import {
  ArrowRightIcon,
  BookOpenTextIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LaptopIcon,
  LayoutGridIcon,
  LayoutPanelLeftIcon,
  LinkedinIcon,
  Loader2Icon,
  LucideIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  TagsIcon,
  UploadIcon,
  UserIcon
} from "lucide-react";
import { FaBrandsGithub } from "../icons/github";
import { FaBrandsGoogle } from "../icons/google";
import { FaBrandsXTwitter } from "../icons/twitter";
import { LogosProducthunt } from "../icons/product-hunt";

export type Icon = LucideIcon;

/**
 * 1. Lucide Icons
 * https://lucide.dev/icons/
 * 
 * 2. Radix Icons
 * https://www.radix-ui.com/icons
 */
export const Icons = {
  // not used at all

  // add: PlusIcon,
  // billing: CreditCardIcon,
  // bookOpen: BookOpenIcon,
  // logo: PuzzleIcon,
  // media: ImageIcon,
  // messages: MessagesSquareIcon,
  // moon: MoonIcon,
  // package: PackageIcon,
  // page: FileIcon,
  // post: FileTextIcon,
  // sun: SunMediumIcon,
  // trash: TrashIcon,

  // warning: AlertTriangleIcon,
  // ellipsis: MoreVerticalIcon,
  // help: HelpCircleIcon,

  // lineChart: LineChartIcon,

  // not used but should keep
  user: UserIcon,
  laptop: LaptopIcon,


  // replaced by lucide icons

  // close: XIcon,
  
  // check: CheckIcon,
  // chevronRight: ChevronRightIcon,
  // arrowUpRight: ArrowUpRightIcon,
  // chevronLeft: ChevronLeftIcon,

  // used as Icons.spinner
  spinner: Loader2Icon,

  // used by name
  arrowRight: ArrowRightIcon,
  search: SearchIcon,
  category: LayoutGridIcon,
  tag: TagsIcon,
  blog: FileTextIcon,
  pricing: CreditCardIcon,
  home: HomeIcon,
  dashboard: LayoutPanelLeftIcon,
  submit: UploadIcon,
  settings: SettingsIcon,
  email: MailIcon,
  github: FaBrandsGithub,
  google: FaBrandsGoogle,
  twitter: FaBrandsXTwitter,
  productHunt: LogosProducthunt,
};
