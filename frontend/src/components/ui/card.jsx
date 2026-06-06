import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, hoverLift = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base Neo-brutalist Card Styles
      "rounded-none border-4 border-black bg-white text-black shadow-neo-md transition-all duration-200",
      // Optional lift effect on hover (great for product grids)
      hoverLift && "hover:-translate-y-2 hover:-translate-x-1 hover:shadow-neo-lg",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b-4 border-black bg-neo-muted/20", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-black text-2xl uppercase tracking-tight leading-none", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-bold text-black/70", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }