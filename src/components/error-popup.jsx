"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, X } from "lucide-react"
import { Button } from "./ui/button"

export function ErrorPopup({ error, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(!!error)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [error, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!error) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
        >
          <div className="bg-white border-2 border-red-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-red-800 font-semibold text-sm">Error</h3>
                    <p className="text-red-700 text-sm mt-1 leading-relaxed">{error}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 text-red-600 hover:bg-red-200 flex-shrink-0 ml-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-1 bg-red-400"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
