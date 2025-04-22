
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-base font-inter leading-6 placeholder-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empowerlocal-blue/40 focus-visible:ring-offset-2 focus-visible:border-empowerlocal-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
