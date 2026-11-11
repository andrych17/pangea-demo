import {
  AirplaneTilt, Bank, Barbell, Barcode, Bell, BookOpen, Briefcase, Buildings, CalendarCheck, Camera, Car, Chalkboard, ChartLineUp,
  ChatCircleDots, Clock, Cloud, Code, Coffee, Confetti, CookingPot, CreditCard, Database, Envelope, FileText, FirstAid, ForkKnife,
  Gear, Globe, GraduationCap, Hammer, Handshake, Heart, Heartbeat, House, Key, Leaf, Lightning, Lock, MapPin, Medal, MicrophoneStage,
  MusicNotes, Package, PaintBrush, Palette, Path, PenNib, Pill, Plant, Plugs, Receipt, Robot, Rocket, Ruler, Scales, ShieldCheck,
  ShoppingBag, Sparkle, Star, Stethoscope, Storefront, Student, Tag, Target, Ticket, Tooth, Trophy, Truck, UserCircle, Users,
  Wallet, Warehouse, Wine,
} from "@phosphor-icons/react/dist/ssr";

// Named icons so presets (plain data) can pick one by string. Works in server and client components.
const ICONS = {
  AirplaneTilt, Bank, Barbell, Barcode, Bell, BookOpen, Briefcase, Buildings, CalendarCheck, Camera, Car, Chalkboard, ChartLineUp,
  ChatCircleDots, Clock, Cloud, Code, Coffee, Confetti, CookingPot, CreditCard, Database, Envelope, FileText, FirstAid, ForkKnife,
  Gear, Globe, GraduationCap, Hammer, Handshake, Heart, Heartbeat, House, Key, Leaf, Lightning, Lock, MapPin, Medal, MicrophoneStage,
  MusicNotes, Package, PaintBrush, Palette, Path, PenNib, Pill, Plant, Plugs, Receipt, Robot, Rocket, Ruler, Scales, ShieldCheck,
  ShoppingBag, Sparkle, Star, Stethoscope, Storefront, Student, Tag, Target, Ticket, Tooth, Trophy, Truck, UserCircle, Users,
  Wallet, Warehouse, Wine,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20, weight = "regular", className }: { name: IconName; size?: number; weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"; className?: string }) {
  const C = ICONS[name];
  return <C size={size} weight={weight} className={className} aria-hidden />;
}
