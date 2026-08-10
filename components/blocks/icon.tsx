import {
  Briefcase,
  Buildings,
  CalendarCheck,
  ChartBar,
  ChartLineUp,
  ChatCircleText,
  ClipboardText,
  Compass,
  Crosshair,
  Factory,
  FileText,
  ForkKnife,
  Gauge,
  Graph,
  HardHat,
  Heartbeat,
  HouseLine,
  LinkSimple,
  ListChecks,
  MagnifyingGlass,
  MapPinArea,
  ShieldCheck,
  Stack,
  Star,
  Users,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import type { IconName } from "@/lib/types";

// The SSR entry doesn't re-export the `Icon` type, so derive it from a concrete
// icon rather than importing a name that isn't there.
type PhosphorIcon = typeof Crosshair;

/**
 * Content icons.
 *
 * Phosphor rather than Lucide for these: the duotone weight gives the service,
 * industry, and process cards a designed feel that a uniform outline stroke
 * can't, and the set is wide enough to find a genuinely apt icon per concept
 * instead of reusing three generic ones.
 *
 * Lucide stays for interface chrome — arrows, chevrons, close, menu, spinners.
 * Two registers, deliberately: chrome should recede, content icons should read.
 *
 * Imported from /dist/ssr so this stays a Server Component.
 */
const map: Record<IconName, PhosphorIcon> = {
  target: Crosshair,
  "map-pin": MapPinArea,
  "file-text": FileText,
  wrench: Wrench,
  "bar-chart": ChartBar,
  building: Buildings,
  home: HouseLine,
  "heart-pulse": Heartbeat,
  briefcase: Briefcase,
  utensils: ForkKnife,
  "hard-hat": HardHat,
  factory: Factory,
  network: Graph,
  search: MagnifyingGlass,
  "trending-up": ChartLineUp,
  "clipboard-check": ClipboardText,
  "message-square": ChatCircleText,
  star: Star,
  link: LinkSimple,
  gauge: Gauge,
  users: Users,
  layers: Stack,
  calendar: CalendarCheck,
  "shield-check": ShieldCheck,
  compass: Compass,
  "list-checks": ListChecks,
};

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const Cmp = map[name];
  if (!Cmp) return null;
  return <Cmp size={size} weight="duotone" aria-hidden="true" />;
}

export function IconTile({ name }: { name: IconName }) {
  return (
    <span className="mb-5 inline-flex size-12 items-center justify-center rounded-card border border-line bg-surface text-teal-ink transition-all duration-300 ease-out-soft group-hover:border-transparent group-hover:bg-brand-black group-hover:text-white">
      <Icon name={name} size={24} />
    </span>
  );
}
