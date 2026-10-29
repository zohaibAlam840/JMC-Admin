import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import type { LeadType, PackageTier } from "./validation";

const MINIMUM_COMPLETION_MS = 3000;
const MAXIMUM_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const CONVERSION_LIFETIME_MS = 10 * 60 * 1000;

export const CONVERSION_COOKIE_NAME = "jmc_lead_conversion";

type FormPurpose = "contact" | "audit";

type FormTokenPayload = {
  purpose: FormPurpose;
  issuedAt: number;
  submissionId: string;
};

export type FormTokenResult =
  | { ok: true; submissionId: string }
  | { ok: false; reason: "unconfigured" | "invalid" | "too_fast" | "expired" };

type ConversionPayload = {
  leadId: string;
  leadType: LeadType;
  tier?: PackageTier;
  expiresAt: number;
};

function securitySecret(): string | null {
  const secret = process.env.LEAD_SECURITY_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

export function leadSecurityConfigured(): boolean {
  return Boolean(securitySecret());
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function encodeSigned(payload: object): string {
  const secret = securitySecret();
  if (!secret) return "";
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

function decodeSigned<T>(token: string): T | null {
  const secret = securitySecret();
  if (!secret || !token) return null;

  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) return null;

  const expected = sign(encoded, secret);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function createFormToken(
  purpose: FormPurpose,
  issuedAt = Date.now(),
  submissionId = randomUUID()
): string {
  return encodeSigned({
    purpose,
    issuedAt,
    submissionId,
  } satisfies FormTokenPayload);
}

export function verifyFormToken(
  token: string,
  purpose: FormPurpose,
  now = Date.now()
): FormTokenResult {
  if (!securitySecret()) return { ok: false, reason: "unconfigured" };

  const payload = decodeSigned<FormTokenPayload>(token);
  if (
    !payload ||
    payload.purpose !== purpose ||
    !Number.isSafeInteger(payload.issuedAt) ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      payload.submissionId
    )
  ) {
    return { ok: false, reason: "invalid" };
  }

  const age = now - payload.issuedAt;
  if (age < MINIMUM_COMPLETION_MS) return { ok: false, reason: "too_fast" };
  if (age > MAXIMUM_FORM_AGE_MS) return { ok: false, reason: "expired" };

  return { ok: true, submissionId: payload.submissionId };
}

export function createRateKey(identity: string): string | null {
  const secret = securitySecret();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(identity || "unknown")
    .digest("hex");
}

export function createConversionToken(payload: {
  leadId: string;
  leadType: LeadType;
  tier?: PackageTier | "";
}): string {
  return encodeSigned({
    leadId: payload.leadId,
    leadType: payload.leadType,
    ...(payload.tier ? { tier: payload.tier } : {}),
    expiresAt: Date.now() + CONVERSION_LIFETIME_MS,
  } satisfies ConversionPayload);
}

export function verifyConversionToken(
  token: string,
  now = Date.now()
): ConversionPayload | null {
  const payload = decodeSigned<ConversionPayload>(token);
  if (
    !payload ||
    !payload.leadId ||
    !payload.leadType ||
    !Number.isSafeInteger(payload.expiresAt) ||
    payload.expiresAt < now
  ) {
    return null;
  }
  return payload;
}
