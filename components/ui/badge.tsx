import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-teal-100 text-teal-800",
        secondary:
          "bg-slate-100 text-slate-800",
        destructive:
          "bg-red-100 text-red-800",
        success:
          "bg-emerald-100 text-emerald-800",
        warning:
          "bg-amber-100 text-amber-800",
        info:
          "bg-blue-100 text-blue-800",
        outline:
          "border border-slate-300 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

