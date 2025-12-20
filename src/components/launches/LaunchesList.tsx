"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useLaunchSelection } from "./LaunchSelectionContext";
import { useLaunches } from "@/lib/useLaunches";
import { useQueryClient } from "@tanstack/react-query";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { fetchLaunchById } from "@/lib/spacex";
import { formatDate, getName } from "@/lib/format";

export function LaunchesList() {
  const { selectedId, select } = useLaunchSelection();
  const { data, isLoading, isError, error, refetch } = useLaunches(30);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  const qc = useQueryClient();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const headerClass = `sticky top-0 z-10 pb-3 backdrop-blur transition-colors border-b ${
    isDark
      ? "bg-zinc-950/95 text-zinc-50 border-zinc-800/70"
      : "bg-white/95 text-zinc-900 border-zinc-200/80"
  }`;
  const headerSubtextClass = isDark ? "text-zinc-300" : "text-zinc-500";
  const inputClass = `w-full rounded-xl border px-3 py-2 pr-10 text-sm outline-none focus:ring-2 transition-colors ${
    isDark
      ? "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:ring-zinc-700"
      : "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-500 focus:ring-zinc-200"
  }`;
  const itemBaseClass = `w-full cursor-pointer text-left rounded-xl border p-4 transition-colors duration-200 outline-none sm:scroll-mt-30 scroll-mt-35 focus-visible:ring-2 ${
    isDark
      ? "border-zinc-800 bg-zinc-900/90 text-zinc-100 focus-visible:ring-zinc-700 hover:bg-zinc-800/90"
      : "border-zinc-200 bg-white/90 text-zinc-900 focus-visible:ring-zinc-300 hover:bg-white"
  }`;
  const itemActiveClass = isDark
    ? "border-zinc-200 bg-gradient-to-r from-zinc-800 via-zinc-800 to-zinc-900 text-zinc-50 shadow-md ring-2 ring-zinc-700"
    : "border-zinc-900 bg-gradient-to-r from-zinc-100 via-white to-zinc-50 text-zinc-950 shadow-md ring-2 ring-zinc-200";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter((l) => l.name.toLowerCase().includes(q));
  }, [data, query]);

  const ROW_GAP = 12;

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 120,
    overscan: 10,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  useEffect(() => {
    if (!selectedId) return;
  
    const idx = filtered.findIndex((l) => l.id === selectedId);
    if (idx < 0) return;
  
    const parent = scrollParentRef.current;
    if (!parent) return;
  
    const viewTop = parent.scrollTop;
    const viewBottom = viewTop + parent.clientHeight;
  
    const vItem = rowVirtualizer
      .getVirtualItems()
      .find((v) => v.index === idx);
  
    if (!vItem) {
      rowVirtualizer.scrollToIndex(idx, { align: "start" });
      return;
    }
  
    const start = vItem.start + idx * ROW_GAP;
    const end = start + vItem.size;
  
    const isVisible = start >= viewTop && end <= viewBottom;
  
    if (!isVisible) {
      rowVirtualizer.scrollToIndex(idx, { align: "start" });
    }
  }, [selectedId, filtered, rowVirtualizer]);
  

  if (isLoading) {
    return (
      <div className="p-4 space-y-3" aria-live="polite">
        <div className={headerClass}>
          <div className="relative flex flex-col gap-2 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-semibold">Launches</div>
              <div className={`mt-0.5 text-xs ${headerSubtextClass}`}>
                Latest SpaceX launches (click to view details)
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`w-full rounded-xl border px-3 py-2 text-sm ${
                isDark
                  ? "border-zinc-800 bg-zinc-900 text-zinc-600"
                  : "border-zinc-200 bg-white text-zinc-400"
              }`}
            >
              Search launches...
            </div>
          </div>
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4" aria-live="polite">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 space-y-2 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          <div className="font-semibold">We couldn’t load launches.</div>
          <div className="opacity-90">
            {error instanceof Error ? error.message : "Something went wrong."}
          </div>
          <div className="text-xs text-red-700 dark:text-red-300">
            Please try again in a moment.
          </div>

          <button
            onClick={() => refetch()}
            className="mt-3 rounded-xl border bg-white px-3 py-2 text-xs hover:bg-zinc-50 dark:border-red-900/20 dark:bg-red-950/50 dark:hover:bg-red-900/40"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <div className="rounded-xl border p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          No launches found.
        </div>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="p-4">
        <div className={headerClass}>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Launches</h2>
              <p className={`mt-0.5 text-xs ${headerSubtextClass}`}>
                Latest SpaceX launches (click to view details)
              </p>
            </div>
            <ThemeToggle className="order-first hidden md:block md:order-none md:ml-auto" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3"
          >
            <div className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search launches..."
                aria-label="Search launches"
                className={inputClass}
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className={`absolute inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-full text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${
                    isDark
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-zinc-700"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-zinc-200"
                  }`}
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-4 space-y-3 rounded-xl p-4 text-sm text-zinc-600 dark:text-zinc-400">
          <div>No results for “{query}”.</div>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="w-full sm:w-auto rounded-lg cursor-pointer border px-3 py-2 text-xs font-medium transition text-center text-zinc-800 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            Reset search
          </button>
        </div>
      </div>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div ref={scrollParentRef} className="h-full overflow-auto">
      <div className="p-4">
        <div className={headerClass}>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Launches</h2>
              <p className={`mt-0.5 text-xs ${headerSubtextClass}`}>
                Latest SpaceX launches (click to view details)
              </p>
            </div>
            <ThemeToggle className="order-first hidden md:block md:order-none md:ml-auto" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3"
          >
            <div className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search launches..."
                aria-label="Search launches"
                className={inputClass}
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className={`absolute inset-y-0 right-2 my-auto flex h-7 w-7 items-center justify-center rounded-full text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${
                    isDark
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-zinc-700"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-zinc-200"
                  }`}
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        </div>


        <div role="listbox" aria-label="SpaceX launches" className="pt-2">
          <div className="relative"  style={{
              height: rowVirtualizer.getTotalSize() + filtered.length * ROW_GAP,
            }}
          >
            {virtualItems.map((virtual) => {
              const launch = filtered[virtual.index];
              if (!launch) return null;
              return (
                <motion.div
                  key={launch.id}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    transform: `translateY(${virtual.start + virtual.index * ROW_GAP}px)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  data-index={virtual.index}
                  ref={rowVirtualizer.measureElement}
                >
                  <motion.button
                    type="button"
                    role="option"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    onMouseEnter={() =>
                      qc.prefetchQuery({
                        queryKey: ["launch", launch.id],
                        queryFn: () => fetchLaunchById(launch.id),
                      })
                    }
                    onFocus={() =>
                      qc.prefetchQuery({
                        queryKey: ["launch", launch.id],
                        queryFn: () => fetchLaunchById(launch.id),
                      })
                    }
                    onClick={() => select(launch.id)}
                    aria-selected={selectedId === launch.id}
                    className={`${itemBaseClass} ${
                      selectedId === launch.id ? itemActiveClass : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {launch.name}
                        </div>
                        <div
                          className={`mt-1 text-xs ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {formatDate(launch.date_utc)}
                        </div>
                        <div
                          className={`mt-1 text-xs ${
                            isDark ? "text-zinc-500" : "text-zinc-600"
                          }`}
                        >
                          Rocket: {getName(launch.rocket)} · Launchpad:{" "}
                          {getName(launch.launchpad)}
                        </div>
                      </div>

                      <div className="shrink-0 text-xs">
                        {launch.success === null ? (
                          <span
                            className={`rounded-full border px-2 py-1 ${
                              isDark
                                ? "border-zinc-700 text-zinc-300"
                                : "border-zinc-400 text-zinc-700"
                            }`}
                          >
                            Unknown
                          </span>
                        ) : launch.success ? (
                          <span className="rounded-full border px-2 py-1 text-emerald-700">
                            Success
                          </span>
                        ) : (
                          <span className="rounded-full border px-2 py-1 text-red-700">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
