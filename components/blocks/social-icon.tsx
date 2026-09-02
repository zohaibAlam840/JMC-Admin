import {
  EnvelopeSimple,
  FacebookLogo,
  GlobeSimple,
  InstagramLogo,
  LinkedinLogo,
  Phone,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { SocialPlatform } from "@/lib/types";

/**
 * Brand marks for the social row on the link hub.
 *
 * Separate from components/blocks/icon.tsx on purpose: those are duotone
 * content icons chosen for meaning, these are filled brand logos that have to
 * be recognisable at 22px and are not interchangeable with them.
 *
 * Imported from the /dist/ssr entry so these stay Server Components.
 */
type PhosphorIcon = typeof InstagramLogo;

const MARKS: Record<SocialPlatform, PhosphorIcon> = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  linkedin: LinkedinLogo,
  x: XLogo,
  youtube: YoutubeLogo,
  tiktok: TiktokLogo,
  email: EnvelopeSimple,
  phone: Phone,
  website: GlobeSimple,
};

/** Used for the accessible name, since the mark itself carries no text. */
export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
  email: "Email",
  phone: "Phone",
  website: "Website",
};

export function SocialIcon({
  platform,
  size = 22,
}: {
  platform: SocialPlatform;
  size?: number;
}) {
  const Mark = MARKS[platform] ?? GlobeSimple;
  return <Mark size={size} weight="fill" aria-hidden="true" />;
}
