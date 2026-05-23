import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "copper" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        variant === "default" && "border-fact-orange bg-[#4a3a20] text-fact-orange",
        variant === "copper" && "border-fact-copper bg-fact-panel-light text-fact-copper",
        variant === "muted" && "border-fact-border bg-fact-panel text-fact-muted",
        className
      )}
      {...props}
    />
  );
}
