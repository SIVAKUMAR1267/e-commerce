import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-14 w-full border-4 border-black bg-white px-4 py-2 text-lg font-bold text-black placeholder:text-black/40",
        "rounded-none transition-all duration-100",
        // Focus state: Turns yellow, adds shadow, removes default thin ring
        "focus-visible:outline-none focus-visible:bg-neo-secondary focus-visible:shadow-neo-sm",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }