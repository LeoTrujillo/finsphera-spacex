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
    "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-colors shadow-sm";
  const themeClasses = isDark
    ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
    : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className={[base, themeClasses, className].filter(Boolean).join(" ")}
    >
      <span>{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
