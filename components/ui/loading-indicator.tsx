import type { ComponentPropsWithoutRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps extends ComponentPropsWithoutRef<"span"> {
  label?: string;
  size?: "sm" | "md";
}

export function LoadingIndicator({
  label,
  size = "sm",
  className,
  ...props
}: LoadingIndicatorProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      role="status"
      aria-live="polite"
      {...props}
    >
      <Loader2
        className={cn(
          "loading-indicator animate-spin text-current",
          size === "md" ? "h-5 w-5" : "h-4 w-4"
        )}
        aria-hidden="true"
      />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
