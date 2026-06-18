import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-[8px] bg-white border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
