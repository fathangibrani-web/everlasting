import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const iconMap: Record<string, IconType> = {
  Instagram: FaInstagram,
  "Twitter / X": FaXTwitter,
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  YouTube: FaYoutube,
  TikTok: FaTiktok,
  Facebook: FaFacebook,
  Website: FaGlobe,
};

export default function SocialIcon({
  platform,
  className = "h-4 w-4",
}: {
  platform: string;
  className?: string;
}) {
  const Icon = iconMap[platform] ?? FaGlobe;
  return <Icon className={className} />;
}
