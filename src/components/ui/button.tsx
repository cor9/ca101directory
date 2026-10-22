import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Theme tokens like bg-primary / bg-background / border-input are NOT defined in
// tailwind.config.ts, so the stock shadcn variants rendered with no background
// (invisible on dark AND light surfaces). These use explicit colors that stay
// readable on both the charcoal frame and white profile cards.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-300 disabled:text-zinc-600 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-[#C2441F] bg-[#C2441F] text-white hover:border-[#A93A19] hover:bg-[#A93A19]",
        destructive:
          "border border-red-700 bg-red-700 text-white hover:border-red-800 hover:bg-red-800",
        outline:
          "border border-zinc-400 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-100",
        secondary:
          "border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700",
        ghost:
          "text-inherit hover:bg-black/10 [.dark_&]:hover:bg-white/10",
        link: "text-sky-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
