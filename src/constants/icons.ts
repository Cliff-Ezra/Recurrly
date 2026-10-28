/**
 * Recurly — V3 icon set.
 *
 * UI glyphs are Lucide (the set the design is drawn with), keyed by what they
 * mean in the app so screens don't depend on Lucide's names. Render them with
 * the design's stroke: <icons.home size={22} strokeWidth={1.75} color={…} />.
 */
import {
  ArrowRight,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  createLucideIcon,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Globe,
  House,
  KeyRound,
  Layers,
  Mail,
  Monitor,
  Moon,
  Pencil,
  Plus,
  ScanLine,
  Search,
  Sun,
  Target,
  User,
  X,
} from "lucide-react-native";

// Lucide's column charts have either no axis or an L-shaped one; the design's
// Insights glyph is three bars standing on a baseline.
const ChartBaseline = createLucideIcon({
  name: "chart-baseline",
  node: [
    ["path", { d: "M3 21h18", key: "baseline" }],
    ["path", { d: "M7 17v-5", key: "bar-left" }],
    ["path", { d: "M12 17V5", key: "bar-middle" }],
    ["path", { d: "M17 17v-8", key: "bar-right" }],
  ],
});

export const icons = {
  // Tab bar
  home: House,
  plans: Layers,
  insights: ChartBaseline,
  account: User,
  add: Plus,
  close: X,

  // Navigation and actions
  back: ChevronLeft,
  chevron: ChevronRight,
  next: ArrowRight,
  search: Search,
  download: Download,
  edit: Pencil,

  // Add subscription
  scan: ScanLine,
  mail: Mail,

  // Auth
  passkey: KeyRound,
  google: Globe,
  show: Eye,
  hide: EyeOff,

  // Settings
  dark: Moon,
  light: Sun,
  auto: Monitor,
  currency: DollarSign,
  budget: Target,
  reminders: Bell,
  remindMe: Clock,
};

export type IconName = keyof typeof icons;

/** Stroke width that matches the design's thin outline glyphs. */
export const iconStroke = 1.75;
