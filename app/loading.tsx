import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-section">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-text-muted">Loading…</p>
      </div>
    </main>
  );
}
