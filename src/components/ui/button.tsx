import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { BUTTON_SIZES } from "@/lib/ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-brand-800 text-white hover:bg-brand-900",
        brand: "bg-brand-800 text-white hover:bg-brand-900",
        /** primary action (call, quote) – copper, as on the hub */
        sun: "bg-biz-copper text-white hover:bg-[#8c3d1c]",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "bg-transparent text-brand-900 ring-1 ring-inset ring-brand-900/70 hover:bg-brand-900 hover:text-white",
        soft: "bg-surface text-brand-800 hover:bg-surface-strong",
        secondary: "bg-white text-brand-900 shadow-soft hover:bg-surface",
        ghost: "text-ink hover:bg-surface hover:text-brand-800",
        link: "h-auto px-0 text-brand-700 underline-offset-4 hover:underline",
      },
      size: {
        default: BUTTON_SIZES.md,
        sm: BUTTON_SIZES.sm,
        lg: BUTTON_SIZES.lg,
        icon: BUTTON_SIZES.icon,
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, };
