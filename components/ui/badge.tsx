import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "accent" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        variant === "default" && "bg-[#1d1d1f] text-white",
        variant === "accent" && "bg-[#f5f5f7] text-[#1d1d1f] ring-1 ring-[#d2d2d7]",
        variant === "muted" && "bg-[#f5f5f7] text-[#86868b]",
        className
      )}
      {...props}
    />
  );
}
