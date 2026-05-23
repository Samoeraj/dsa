import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-violet-100 text-violet-800",
        variant === "success" && "bg-emerald-100 text-emerald-800",
        variant === "muted" && "bg-slate-100 text-slate-600",
        className
      )}
      {...props}
    />
  );
}
