"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const base =
    "absolute -top-3 right-0 z-30 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xl shadow-md transition-colors self-end md:static md:h-11 md:w-11";
  const themeClasses = isDark
    ? "border-zinc-700 bg-zinc-900/90 text-zinc-100 hover:bg-zinc-800/90"
    : "border-zinc-200 bg-white/90 text-zinc-900 hover:bg-white";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className={[base, themeClasses, className].filter(Boolean).join(" ")}
    >
      <span aria-hidden>{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
