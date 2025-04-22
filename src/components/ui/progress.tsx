
// Progress bar refinement: height, rounds, brand color
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "progress-bar bg-gray-100 overflow-hidden", // use new class
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "progress-fill transition-all",
        value >= 90 ? "progress-success" : value >= 60 ? "progress-warning" : "progress-error"
      )}
      style={{ width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
