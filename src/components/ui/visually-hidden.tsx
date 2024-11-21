
import * as React from "react"

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0">
      {children}
    </span>
  )
}

export { VisuallyHidden }