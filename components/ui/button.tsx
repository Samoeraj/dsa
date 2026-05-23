import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fact-orange focus-visible:ring-offset-2 focus-visible:ring-offset-fact-bg disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "rounded-sm border-2 border-[#c46a10] bg-gradient-to-b from-fact-orange to-[#c46a10] text-[#1a1000] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-110",
        secondary:
          "rounded-sm border-2 border-fact-border-hi bg-gradient-to-b from-fact-panel-light to-fact-panel text-fact-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-fact-copper",
        ghost: "rounded-sm text-fact-muted hover:bg-fact-panel hover:text-fact-text",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";
