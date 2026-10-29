import assert from "node:assert/strict";
import {
  createConversionToken,
  createFormToken,
  verifyConversionToken,
  verifyFormToken,
} from "../lib/leads/security";
import {
  hasHoneypotValue,
  validateAuditLead,
  validateContactLead,
} from "../lib/leads/validation";
import { notifyNewLead } from "../lib/notify";

async function main() {
const originalSecret = process.env.LEAD_SECURITY_SECRET;
process.env.LEAD_SECURITY_SECRET = "form-check-secret-that-is-longer-than-thirty-two-characters";

function data(values: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
}

const review = validateContactLead(
  data({
    name: "Avery Jones",
    email: "AVERY@EXAMPLE.COM",
    phone: "+1 (281) 555-0100",
    business: "Example Co",
    website: "example.com",
    message: "Local visibility has declined.",
    tier: "metro",
  })
);
assert(review.lead, "a valid Visibility Review should parse");
assert.equal(review.lead.leadType, "visibility_review");
assert.equal(review.lead.email, "avery@example.com");
assert.equal(review.lead.website, "https://example.com/");
assert.equal(review.lead.tier, "metro");

const sprint = validateContactLead(
  data({
    type: "sprint",
    name: "Avery Jones",
    email: "avery@example.com",
    business: "Example Co",
    message: "The site needs a fixed-scope launch foundation.",
    tier: "forged-tier",
  })
);
assert(sprint.lead, "a valid Sprint Consultation should parse");
assert.equal(sprint.lead.leadType, "sprint_consultation");
assert.equal(sprint.lead.tier, "", "unknown tiers must never be stored");

const badContact = validateContactLead(
  data({
    name: "Avery Jones",
    email: "not-an-email",
    business: "Example Co",
    website: "ftp://example.com/file",
    message: "Help",
  })
);
assert(!badContact.lead);
assert(badContact.errors.email);
assert(badContact.errors.website);

const audit = validateAuditLead(
  data({
    business: "Example Co",
    website: "https://example.com",
    profile: "https://maps.google.com/example",
    email: "owner@example.com",
  })
);
assert(audit.lead, "a valid Free Visibility Audit should parse");
assert.equal(audit.lead.leadType, "gbp_audit");
assert.equal(
  audit.lead.googleBusinessProfileUrl,
  "https://maps.google.com/example"
);

const badAudit = validateAuditLead(
  data({ business: "Example Co", email: "owner@example.com" })
);
assert(!badAudit.lead);
assert(badAudit.errors.website);

assert(
  hasHoneypotValue(data({ company_website: "https://spam.example" })),
  "the honeypot must be detected server-side"
);

const now = 1_800_000_000_000;
const submissionId = "018f1f0e-7b2b-4d0a-8f4d-f4f935862f09";
const validToken = createFormToken("contact", now - 4_000, submissionId);
assert.deepEqual(verifyFormToken(validToken, "contact", now), {
  ok: true,
  submissionId,
});
assert.equal(
  verifyFormToken(createFormToken("contact", now, submissionId), "contact", now)
    .ok,
  false,
  "sub-three-second submissions must fail the signed timing check"
);
assert.equal(
  verifyFormToken(validToken, "audit", now).ok,
  false,
  "a token for one form must not authorize the other"
);

const conversion = createConversionToken({
  leadId: "lead-123",
  leadType: "sprint_consultation",
  tier: "regional",
});
const verifiedConversion = verifyConversionToken(conversion);
assert(verifiedConversion);
assert.equal(verifiedConversion.leadId, "lead-123");
assert.equal(verifiedConversion.tier, "regional");

const mailEnvironment = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  LEAD_NOTIFICATION_EMAIL: process.env.LEAD_NOTIFICATION_EMAIL,
  LEAD_NOTIFICATION_FROM: process.env.LEAD_NOTIFICATION_FROM,
};
const originalFetch = globalThis.fetch;
const mailRequest: {
  current: { url: string; init?: RequestInit } | null;
} = { current: null };

process.env.RESEND_API_KEY = "re_test_key";
process.env.LEAD_NOTIFICATION_EMAIL =
  "owner@example.com,backup@example.com";
process.env.LEAD_NOTIFICATION_FROM = "JMC Website <notify@example.com>";
globalThis.fetch = async (input, init) => {
  mailRequest.current = { url: String(input), init };
  return new Response(JSON.stringify({ id: "email-123" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

const notification = await notifyNewLead({
  leadType: "gbp_audit",
  idempotencyKey: "jmc-lead-test-123",
  email: "prospect@example.com",
  business: "Example <Co>",
  website: "https://example.com/",
  googleBusinessProfileUrl: "https://maps.google.com/example",
  sourcePage: "/google-business-profile-optimization/",
  sourceCta: "Get a Free Visibility Audit",
});

assert.deepEqual(notification, { status: "sent", messageId: "email-123" });
assert(mailRequest.current, "the configured notification should call Resend");
const capturedMailRequest = mailRequest.current;
assert.equal(capturedMailRequest.url, "https://api.resend.com/emails");
assert.equal(
  new Headers(capturedMailRequest.init?.headers).get("Idempotency-Key"),
  "jmc-lead-test-123"
);
const mailBody = JSON.parse(String(capturedMailRequest.init?.body)) as {
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
};
assert.deepEqual(mailBody.to, ["owner@example.com", "backup@example.com"]);
assert.equal(mailBody.reply_to, "prospect@example.com");
assert.match(mailBody.subject, /Free Visibility Audit Request/);
assert.match(mailBody.text, /Google Business Profile/);
assert.match(mailBody.html, /Example &lt;Co&gt;/);
assert(!mailBody.html.includes("Example <Co>"));

globalThis.fetch = originalFetch;
for (const [key, value] of Object.entries(mailEnvironment)) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

if (originalSecret === undefined) delete process.env.LEAD_SECURITY_SECRET;
else process.env.LEAD_SECURITY_SECRET = originalSecret;

console.log(
  "Form checks passed: validation, normalization, spam, signed timing, conversion markers, and Resend payloads."
);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
