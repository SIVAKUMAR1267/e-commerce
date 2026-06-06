import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // BASE STYLES: Thick border, bold uppercase, fast transition, focus states
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-4 border-black rounded-none",
  {
    variants: {
      variant: {
        // PRIMARY (Red): Has hard shadow, shifts down and removes shadow on click
        default:
          "bg-neo-accent text-black shadow-neo-sm hover:bg-neo-accent/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        // SECONDARY (Yellow): Same physics, different color
        secondary:
          "bg-neo-secondary text-black shadow-neo-sm hover:bg-neo-secondary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        // MUTED (Violet): Same physics
        muted:
          "bg-neo-muted text-black shadow-neo-sm hover:bg-neo-muted/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        // OUTLINE: White background, still has the click physics
        outline:
          "bg-white text-black shadow-neo-sm hover:bg-neo-bg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        // GHOST: No border initially, border appears on hover, no shadow physics
        ghost: "border-transparent hover:border-black hover:bg-neo-bg",
        // LINK: Just bold text with underline
        link: "text-black underline-offset-4 hover:underline border-none",
      },
      size: {
        // Sizing is generally chunkier in Neo-brutalism
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }