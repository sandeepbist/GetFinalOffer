import { Skeleton } from "@/components/ui/skeleton";

export default function MainLoading() {
  return (
    <main className="min-h-screen bg-section px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Welcome banner skeleton */}
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile card skeleton */}
          <div className="h-fit space-y-5 rounded-2xl border border-border bg-surface p-6">
            <div className="flex justify-center">
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <Skeleton className="mx-auto h-5 w-40" />
            <Skeleton className="mx-auto h-4 w-28" />
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="space-y-3 border-t border-border/70 pt-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Content area skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
