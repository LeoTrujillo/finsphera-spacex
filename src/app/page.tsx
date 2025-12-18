import { AppLayout } from "@/components/layout/AppLayout";
import { LaunchesList } from "@/components/launches/LaunchesList";
import { LaunchDetailsPanel } from "@/components/launches/LaunchDetailsPanel";
import { LaunchSelectionProvider } from "@/components/launches/LaunchSelectionContext";

export default function Home() {
  return (
    <LaunchSelectionProvider>
      <AppLayout
        sidebar={<LaunchesList />}
        main={<LaunchDetailsPanel />}
      />
    </LaunchSelectionProvider>
  );
}
