import {
  ArrowRightIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LayoutPanelLeftIcon,
  Loader2Icon,
  type LucideIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  TagsIcon,
  UploadIcon,
} from "lucide-react";
import { FaBrandsGithub } from "../icons/github";
import { FaBrandsGoogle } from "../icons/google";
import { LogosProducthunt } from "../icons/product-hunt";
import { FaBrandsXTwitter } from "../icons/twitter";

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
  category: LayoutGridIcon,
  tag: TagsIcon,
  blog: FileTextIcon,
  pricing: CreditCardIcon,
  home: HomeIcon,
  dashboard: LayoutDashboardIcon,
  submit: UploadIcon,
  settings: SettingsIcon,
  email: MailIcon,

  github: FaBrandsGithub,
  google: FaBrandsGoogle,
  twitter: FaBrandsXTwitter,
  productHunt: LogosProducthunt,
};
