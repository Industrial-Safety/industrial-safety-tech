export default function TrabajadorLoading() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">

      {/* Sidebar skeleton */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-surface shrink-0 h-full">

        {/* Avatar area */}
        <div className="flex flex-col items-center border-b border-slate-800 py-6 px-4 gap-3">
          <div className="h-20 w-20 rounded-full bg-slate-800 animate-pulse" />
          <div className="h-4 w-32 rounded bg-slate-800 animate-pulse" />
          <div className="h-5 w-24 rounded-full bg-slate-800 animate-pulse" />
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-2 p-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            >
              <div className="h-5 w-5 rounded bg-slate-800 animate-pulse shrink-0" />
              <div
                className="h-4 rounded bg-slate-800 animate-pulse"
                style={{ width: `${60 + (i % 3) * 20}px` }}
              />
            </div>
          ))}
        </nav>

        {/* Logout button */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="h-5 w-5 rounded bg-slate-800 animate-pulse shrink-0" />
            <div className="h-4 w-28 rounded bg-slate-800 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Mobile header skeleton */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-surface/50 px-4 md:hidden">
          <div className="h-8 w-8 rounded-lg bg-slate-800 animate-pulse" />
          <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
          <div className="h-8 w-8 rounded-lg bg-slate-800 animate-pulse opacity-0" />
        </div>

        {/* Navbar skeleton */}
        <div className="h-14 border-b border-slate-800 bg-surface/50 px-6 flex items-center justify-end gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-slate-800 animate-pulse" />
        </div>

        {/* Page content skeleton */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">

            {/* Header block */}
            <div className="space-y-2">
              <div className="h-8 w-64 rounded bg-slate-800 animate-pulse" />
              <div className="h-4 w-96 rounded bg-slate-800 animate-pulse" />
            </div>

            {/* KPI cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-surface/40 p-5 space-y-3">
                  <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
                  <div className="h-8 w-16 rounded bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Content cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-surface/40 p-5 space-y-4">
                  <div className="h-5 w-40 rounded bg-slate-800 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-slate-800 animate-pulse" />
                    <div className="h-3 w-4/5 rounded bg-slate-800 animate-pulse" />
                    <div className="h-3 w-3/5 rounded bg-slate-800 animate-pulse" />
                  </div>
                  <div className="h-9 w-28 rounded-lg bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
