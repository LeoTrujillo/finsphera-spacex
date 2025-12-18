"use client";

export function AppLayout({
  sidebar,
  main,
}: {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}) {
  return (
    <div className="h-screen md:flex">
      <aside className="md:w-80 md:shrink-0 border-b md:border-b-0 md:border-r">
        <div className="h-[40vh] overflow-auto md:h-screen">{sidebar}</div>
      </aside>

      <section className="flex-1 overflow-auto md:h-screen">{main}</section>
    </div>
  );
}
