"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type LaunchSelectionContextValue = {
  selectedId: string | null;
  select: (id: string) => void;
  clear: () => void;
};

const LaunchSelectionContext =
  createContext<LaunchSelectionContextValue | null>(null);

const PARAM = "launch";

export function LaunchSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get(PARAM);

  const value = useMemo<LaunchSelectionContextValue>(() => {
    const select = (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAM, id);
      router.replace(`${pathname}?${params.toString()}`);
    };

    const clear = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(PARAM);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    };

    return { selectedId, select, clear };
  }, [pathname, router, searchParams, selectedId]);

  return (
    <LaunchSelectionContext.Provider value={value}>
      {children}
    </LaunchSelectionContext.Provider>
  );
}

export function useLaunchSelection() {
  const ctx = useContext(LaunchSelectionContext);
  if (!ctx) {
    throw new Error(
      "useLaunchSelection must be used within LaunchSelectionProvider"
    );
  }
  return ctx;
}
