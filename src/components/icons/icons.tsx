import {
  ArrowRightIcon,
  CameraIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HandshakeIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LayoutListIcon,
  Loader2Icon,
  type LucideIcon,
  MailIcon,
  MicIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TagsIcon,
  UploadIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { FaBrandsGitHub } from "../icons/github";
import { FaBrandsGoogle } from "../icons/google";
import { LogosProductHunt } from "../icons/product-hunt";
import { FaBrandsXTwitter } from "../icons/twitter";
import { IonLogoYoutube } from "./youtube";

export type Icon = LucideIcon;

/**
 * 1. Lucide Icons
 * https://lucide.dev/icons/
 *
 * 2. Radix Icons
 * https://www.radix-ui.com/icons
 */
export const Icons = {
  spinner: Loader2Icon,

  // used by name
  arrowRight: ArrowRightIcon,
  search: SearchIcon,
  collection: LayoutListIcon,
  category: LayoutGridIcon,
  tag: TagsIcon,
  blog: FileTextIcon,
  pricing: CreditCardIcon,
  home: HomeIcon,
  dashboard: LayoutDashboardIcon,
  submit: UploadIcon,
  settings: SettingsIcon,
  studio: LayoutListIcon,
  email: MailIcon,

  // new icons for category grid and featured listings
  theater: LayoutGridIcon, // Using LayoutGridIcon as theater icon
  camera: CameraIcon,
  video: VideoIcon,
  users: UsersIcon,
  star: StarIcon,
  mic: MicIcon,
  externalLink: ExternalLinkIcon,
  shieldCheck: ShieldCheckIcon,
  sparkles: SparklesIcon,
  handshake: HandshakeIcon,

  github: FaBrandsGitHub,
  google: FaBrandsGoogle,
  twitter: FaBrandsXTwitter,
  youtube: IonLogoYoutube,
  productHunt: LogosProductHunt,
};
