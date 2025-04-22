
// Button: consistent typography, amber CTAs, improved hover
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg h-10 px-4 py-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empowerlocal-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none heading-4",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive: "bg-error text-white hover:bg-error/90",
        outline: "btn-secondary",
        secondary: "btn-secondary",
        ghost: "btn-text",
        link: "cta-link",
        gradient: "bg-gradient-to-r from-empowerlocal-teal to-empowerlocal-blue text-white hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 text-base",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-lg px-8 text-base",
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
