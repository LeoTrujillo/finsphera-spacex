import { AppLayout } from "@/components/layout/AppLayout";
import { LaunchesList } from "@/components/launches/LaunchesList";
import { LaunchDetailsPanel } from "@/components/launches/LaunchDetailsPanel";
import { LaunchSelectionProvider } from "@/components/launches/LaunchSelectionContext";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LaunchSelectionProvider>
        <AppLayout
          sidebar={<LaunchesList />}
          main={<LaunchDetailsPanel />}
        />
      </LaunchSelectionProvider>
    </Suspense>
  );
}
