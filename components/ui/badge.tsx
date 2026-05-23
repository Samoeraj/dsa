import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "muted",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "muted" | "ink" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-medium uppercase tracking-widest",
        variant === "muted" && "text-muted",
        variant === "ink" && "text-ink",
        className
      )}
      {...props}
    />
  );
}
