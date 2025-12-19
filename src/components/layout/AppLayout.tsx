"use client";

import { useState, useEffect } from "react";
import { useLaunchSelection } from "../launches/LaunchSelectionContext";
import { useTheme } from "next-themes";

export function AppLayout({
  sidebar,
  main,
}: {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}) {
  const [activePane, setActivePane] = useState<"list" | "details">("list");
  const { selectedId } = useLaunchSelection();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (selectedId) setActivePane("details");
  }, [selectedId]);

  const tabBase =
    "rounded-full border px-4 py-2 text-sm font-medium transition-colors";
  const activeTab = isDark
    ? "border-zinc-100/70 bg-zinc-100 text-zinc-900"
    : "border-zinc-900/70 bg-zinc-900 text-white";
  const inactiveTab = isDark
    ? "border-zinc-700 text-zinc-200 hover:bg-zinc-800"
    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100";
  const barClass = isDark
    ? "border-zinc-800/70 bg-zinc-950/90 text-zinc-50"
    : "border-zinc-200/80 bg-white/90 text-zinc-900";

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div
        className={`sticky top-0 z-30 grid grid-cols-2 gap-2 border-b p-3 backdrop-blur md:hidden ${barClass}`}
      >
        <button
          type="button"
          aria-pressed={activePane === "list"}
          onClick={() => setActivePane("list")}
          className={`${tabBase} ${activePane === "list" ? activeTab : inactiveTab}`}
        >
          List
        </button>
        <button
          type="button"
          aria-pressed={activePane === "details"}
          onClick={() => setActivePane("details")}
          className={`${tabBase} ${activePane === "details" ? activeTab : inactiveTab}`}
        >
          Details
        </button>
      </div>

      <aside
        className={`${
          activePane === "list" ? "block" : "hidden"
        } md:block md:w-80 md:shrink-0 md:border-b-0 md:border-r`}
      >
        <div className="max-h-[92vh] overflow-auto md:h-screen md:max-h-none">
          {sidebar}
        </div>
      </aside>

      <section
        className={`${
          activePane === "details" ? "block" : "hidden"
        } flex-1 overflow-auto md:block md:h-screen`}
      >
        {main}
      </section>
    </div>
  );
}
