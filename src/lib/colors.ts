export type AccentColor =
  | "rose"
  | "blue"
  | "emerald"
  | "amber"
  | "violet"
  | "cyan";

type ColorClasses = {
  badge: string;
  text: string;
  bg: string;
  ring: string;
  gradient: string;
};

const colorMap: Record<AccentColor, ColorClasses> = {
  rose: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-600",
    ring: "ring-rose-500",
    gradient: "from-rose-500 to-orange-400",
  },
  blue: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-600",
    ring: "ring-blue-500",
    gradient: "from-blue-500 to-cyan-400",
  },
  emerald: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-600",
    ring: "ring-emerald-500",
    gradient: "from-emerald-500 to-teal-400",
  },
  amber: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-600",
    ring: "ring-amber-500",
    gradient: "from-amber-500 to-yellow-400",
  },
  violet: {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-600",
    ring: "ring-violet-500",
    gradient: "from-violet-500 to-fuchsia-400",
  },
  cyan: {
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-600",
    ring: "ring-cyan-500",
    gradient: "from-cyan-500 to-blue-400",
  },
};

export function getColorClasses(color?: string): ColorClasses {
  if (color && color in colorMap) {
    return colorMap[color as AccentColor];
  }
  return colorMap.amber;
}
