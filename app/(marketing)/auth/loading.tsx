import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-section p-4">
      <div className="w-full max-w-md space-y-5">
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-56 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="space-y-4 rounded-2xl border border-border/70 bg-surface/90 p-6 shadow-[0_18px_50px_-38px_var(--shadow)]">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </main>
  );
}
