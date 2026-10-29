export const LEAD_TYPES = [
  "visibility_review",
  "sprint_consultation",
  "gbp_audit",
] as const;

export type LeadType = (typeof LEAD_TYPES)[number];

export const PACKAGE_TIERS = [
  "neighborhood",
  "citywide",
  "metro",
  "regional",
  "national",
  "national-plus",
] as const;

export type PackageTier = (typeof PACKAGE_TIERS)[number];

export const LEAD_LIMITS = {
  name: 120,
  email: 254,
  phone: 32,
  business: 160,
  url: 2048,
  message: 5000,
  sourceCta: 160,
  pagePath: 256,
} as const;

export type LeadValues = {
  name: string;
  email: string;
  phone: string;
  business: string;
  website: string;
  profile: string;
  message: string;
  tier: string;
};

export type ValidLead = {
  leadType: LeadType;
  name: string;
  email: string;
  phone: string;
  business: string;
  website: string;
  googleBusinessProfileUrl: string;
  message: string;
  sourceCta: string;
  sourcePage: string;
  tier: PackageTier | "";
};

export type LeadValidation = {
  values: LeadValues;
  errors: Record<string, string>;
  lead?: ValidLead;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function formString(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function overLimit(value: string, maximum: number): boolean {
  return value.length > maximum;
}

function normalizeWebUrl(value: string): string | null {
  if (!value) return "";

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function validateShared(values: LeadValues, errors: Record<string, string>) {
  if (!values.email) {
    errors.email = "An email address is needed to send the reply to.";
  } else if (
    overLimit(values.email, LEAD_LIMITS.email) ||
    !EMAIL_PATTERN.test(values.email)
  ) {
    errors.email = "That email address does not look right.";
  }

  if (values.phone) {
    const digits = values.phone.replace(/\D/g, "");
    if (
      overLimit(values.phone, LEAD_LIMITS.phone) ||
      digits.length < 7 ||
      digits.length > 20
    ) {
      errors.phone = "Enter a phone number with 7 to 20 digits.";
    }
  }

  if (!values.business) {
    errors.business = "Enter the business name.";
  } else if (overLimit(values.business, LEAD_LIMITS.business)) {
    errors.business = `Keep the business name under ${LEAD_LIMITS.business} characters.`;
  }
}

function normalizedTier(value: string): PackageTier | "" {
  return (PACKAGE_TIERS as readonly string[]).includes(value)
    ? (value as PackageTier)
    : "";
}

export function validateContactLead(formData: FormData): LeadValidation {
  const isSprint = formString(formData, "type") === "sprint";
  const values: LeadValues = {
    name: formString(formData, "name"),
    email: formString(formData, "email").toLowerCase(),
    phone: formString(formData, "phone"),
    business: formString(formData, "business"),
    website: formString(formData, "website"),
    profile: "",
    message: formString(formData, "message"),
    tier: formString(formData, "tier"),
  };
  const errors: Record<string, string> = {};

  validateShared(values, errors);

  if (!values.name) {
    errors.name = "A name is needed so the reply is addressed to someone.";
  } else if (overLimit(values.name, LEAD_LIMITS.name)) {
    errors.name = `Keep the name under ${LEAD_LIMITS.name} characters.`;
  }

  if (!values.message) {
    errors.message = "A sentence or two about what is not working is enough.";
  } else if (overLimit(values.message, LEAD_LIMITS.message)) {
    errors.message = `Keep the message under ${LEAD_LIMITS.message.toLocaleString()} characters.`;
  }

  const website = normalizeWebUrl(values.website);
  if (website === null || overLimit(values.website, LEAD_LIMITS.url)) {
    errors.website = "Enter a valid website address beginning with http:// or https://.";
  }

  if (Object.keys(errors).length > 0) return { values, errors };

  const leadType: LeadType = isSprint
    ? "sprint_consultation"
    : "visibility_review";

  return {
    values,
    errors,
    lead: {
      leadType,
      name: values.name,
      email: values.email,
      phone: values.phone,
      business: values.business,
      website: website ?? "",
      googleBusinessProfileUrl: "",
      message: values.message,
      sourceCta: isSprint
        ? "Request a Sprint Consultation"
        : "Request a Visibility Review",
      sourcePage: "/contact/",
      tier: normalizedTier(values.tier),
    },
  };
}

export function validateAuditLead(formData: FormData): LeadValidation {
  const values: LeadValues = {
    name: "",
    email: formString(formData, "email").toLowerCase(),
    phone: formString(formData, "phone"),
    business: formString(formData, "business"),
    website: formString(formData, "website"),
    profile: formString(formData, "profile"),
    message: "",
    tier: "",
  };
  const errors: Record<string, string> = {};

  validateShared(values, errors);

  const website = normalizeWebUrl(values.website);
  if (!values.website) {
    errors.website = "A website address is needed to run the audit against.";
  } else if (website === null || overLimit(values.website, LEAD_LIMITS.url)) {
    errors.website = "Enter a valid website address beginning with http:// or https://.";
  }

  const profile = normalizeWebUrl(values.profile);
  if (profile === null || overLimit(values.profile, LEAD_LIMITS.url)) {
    errors.profile = "Enter a valid Google Business Profile address.";
  }

  if (Object.keys(errors).length > 0) return { values, errors };

  return {
    values,
    errors,
    lead: {
      leadType: "gbp_audit",
      name: "",
      email: values.email,
      phone: values.phone,
      business: values.business,
      website: website ?? "",
      googleBusinessProfileUrl: profile ?? "",
      message: "",
      sourceCta: "Get a Free Visibility Audit",
      sourcePage: "/google-business-profile-optimization/",
      tier: "",
    },
  };
}

export function hasHoneypotValue(formData: FormData): boolean {
  return Boolean(formString(formData, "company_website"));
}
