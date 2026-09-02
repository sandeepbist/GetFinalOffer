"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  // global-error replaces the root layout, so it cannot rely on the app's
  // stylesheet; styles are inline for exactly this reason.
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-[#0c1222] antialiased"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="mb-6 flex items-center justify-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-xl font-bold tracking-tight text-white">
                GetFinalOffer
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              The page failed to load. The error has been reported; you can
              try again, and if it keeps happening, come back in a few
              minutes.
            </p>
            {error.digest && (
              <p className="mt-4 font-mono text-xs text-slate-600">
                Reference: {error.digest}
              </p>
            )}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Try again
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="cursor-pointer rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
              >
                Go home
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
