
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg h-10 px-4 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-empowerlocal-gold via-amber-400 to-amber-600 text-white shadow-[0_3px_8px_rgba(245,158,11,0.12)] hover:brightness-110 hover:shadow-lg active:brightness-95 active:shadow flex", // Gradient gold-amber, stronger shadow
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "bg-white border border-gray-200 text-empowerlocal-navy hover:bg-gray-50 hover:border-gray-300 shadow-none",
        secondary:
          "bg-white text-empowerlocal-navy border border-gray-100 hover:bg-gray-50 shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-empowerlocal-blue underline-offset-4 hover:underline",
        gradient: "bg-empowerlocal-gradient hover:opacity-90 text-white",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
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

