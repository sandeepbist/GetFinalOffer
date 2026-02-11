import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative isolate overflow-hidden rounded-md bg-muted/55",
        "before:absolute before:inset-0 before:-translate-x-full before:content-['']",
        "before:animate-[skeleton-shimmer_1.8s_ease-in-out_infinite]",
        "before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.24),transparent)]",
        "dark:before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.07),transparent)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
