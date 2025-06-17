import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export function Dialog({ children, ...props }) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
}

export const DialogTrigger = DialogPrimitive.Trigger

export function DialogContent({ children, className = "", ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogPrimitive.Content
        {...props}
        className={`fixed z-50 left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg ${className}`}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-gray-900 mb-2">{children}</h2>
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-600 mb-4">{children}</p>
}

export function DialogFooter({ children }) {
  return <div className="flex justify-end space-x-2 mt-6">{children}</div>
}
