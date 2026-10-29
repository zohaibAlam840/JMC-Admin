import { ImageResponse } from "next/og";
import { SocialImageArtwork } from "@/components/seo/social-image";

export const alt =
  "Jordan Marketing Consultants, Houston-area SEO based in League City";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<SocialImageArtwork />, size);
}
