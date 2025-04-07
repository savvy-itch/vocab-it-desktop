import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-full bg-slate-300 dark:bg-zinc-200", className)}
      {...props}
    />
  )
}

export { Skeleton }
