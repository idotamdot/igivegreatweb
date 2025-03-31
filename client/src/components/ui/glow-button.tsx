import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glowButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-gray-100 active:bg-gray-200",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <button
        className={cn(
          glowButtonVariants({ size, className }),
          "glow-button transition-shadow duration-300 group"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
GlowButton.displayName = "GlowButton";

export { GlowButton, glowButtonVariants };
