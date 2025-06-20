"use client"

import { useState, useEffect, useCallback } from "react"

export function useDynamicPositioning(
  triggerRef,
  contentRef,
  config,
) {
  const [position, setPosition] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const content = contentRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const newPosition = {}
    let side = config.preferredSide

    // Check if preferred position fits in viewport
    const spaceAbove = trigger.top
    const spaceBelow = viewport.height - trigger.bottom
    const spaceLeft = trigger.left
    const spaceRight = viewport.width - trigger.right

    // Auto-flip logic
    if (side === "bottom" && spaceBelow < content.height + config.padding) {
      if (spaceAbove > content.height + config.padding) {
        side = "top"
      }
    } else if (side === "top" && spaceAbove < content.height + config.padding) {
      if (spaceBelow > content.height + config.padding) {
        side = "bottom"
      }
    } else if (side === "right" && spaceRight < content.width + config.padding) {
      if (spaceLeft > content.width + config.padding) {
        side = "left"
      }
    } else if (side === "left" && spaceLeft < content.width + config.padding) {
      if (spaceRight > content.width + config.padding) {
        side = "right"
      }
    }

    // Calculate position based on final side
    switch (side) {
      case "top":
        newPosition.bottom = viewport.height - trigger.top + config.offset
        break
      case "bottom":
        newPosition.top = trigger.bottom + config.offset
        break
      case "left":
        newPosition.right = viewport.width - trigger.left + config.offset
        break
      case "right":
        newPosition.left = trigger.right + config.offset
        break
    }

    // Calculate alignment
    if (side === "top" || side === "bottom") {
      switch (config.align) {
        case "start":
          newPosition.left = trigger.left
          break
        case "center":
          newPosition.left = trigger.left + (trigger.width - content.width) / 2
          break
        case "end":
          newPosition.left = trigger.right - content.width
          break
      }

      // Ensure content stays within viewport horizontally
      if (newPosition.left < config.padding) {
        newPosition.left = config.padding
      } else if (newPosition.left + content.width > viewport.width - config.padding) {
        newPosition.left = viewport.width - content.width - config.padding
      }
    } else {
      switch (config.align) {
        case "start":
          newPosition.top = trigger.top
          break
        case "center":
          newPosition.top = trigger.top + (trigger.height - content.height) / 2
          break
        case "end":
          newPosition.top = trigger.bottom - content.height
          break
      }

      // Ensure content stays within viewport vertically
      if (newPosition.top < config.padding) {
        newPosition.top = config.padding
      } else if (newPosition.top + content.height > viewport.height - config.padding) {
        newPosition.top = viewport.height - content.height - config.padding
      }
    }

    setPosition(newPosition)
  }, [triggerRef, contentRef, config])

  useEffect(() => {
    if (isVisible) {
      calculatePosition()

      const handleResize = () => calculatePosition()
      const handleScroll = () => calculatePosition()

      window.addEventListener("resize", handleResize)
      window.addEventListener("scroll", handleScroll, true)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("scroll", handleScroll, true)
      }
    }
  }, [isVisible, calculatePosition])

  return {
    position,
    setIsVisible,
    calculatePosition,
  }
}