"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDynamicPositioning } from "../hooks/use-dynamic-positioning"

export function EnhancedDropdownMenu({
  trigger,
  children,
  align = "end",
  side = "bottom",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  const { position, setIsVisible } = useDynamicPositioning(triggerRef, contentRef, {
    preferredSide: side,
    align,
    offset: 8,
    padding: 12,
  })

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen, setIsVisible])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target) &&
        !contentRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      <span
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-block cursor-pointer focus:outline-none"
      >
        {trigger}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              ...position,
              zIndex: 9999,
            }}
            className={`bg-white border border-slate-200 shadow-lg rounded-xl ${className}`}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
