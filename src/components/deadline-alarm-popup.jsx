"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Bell, X, CalendarDays, Volume2, VolumeX, ChevronDown, AlarmClockIcon as Snooze } from "lucide-react"
import { useGlobalAlarm } from "../hooks/use-global-alarm"
import { SNOOZE_OPTIONS } from "../hooks/use-alarm-system"
import { useDynamicPositioning } from "../hooks/use-dynamic-positioning"

export function DeadlineAlarmPopup() {
  const { activeAlarms, snoozeAlarm, dismissAlarm, dismissAllAlarms, isAudioEnabled, setIsAudioEnabled } =
    useGlobalAlarm()

  const [showSnoozeOptions, setShowSnoozeOptions] = useState(null)
  const snoozeButtonRef = useRef(null)
  const snoozeMenuRef = useRef(null)

  const { position, setIsVisible } = useDynamicPositioning(snoozeButtonRef, snoozeMenuRef, {
    preferredSide: "top",
    align: "center",
    offset: 8,
    padding: 12,
  })

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDeadlineUrgency = (daysLeft) => {
    if (daysLeft < 0) return { level: "overdue", color: "text-red-600", bgColor: "bg-red-50 border-red-200" }
    if (daysLeft === 0) return { level: "today", color: "text-red-600", bgColor: "bg-red-50 border-red-200" }
    if (daysLeft === 1)
      return { level: "tomorrow", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200" }
    if (daysLeft <= 3) return { level: "soon", color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200" }
    return { level: "normal", color: "text-green-600", bgColor: "bg-green-50 border-green-200" }
  }

  const handleSnoozeClick = (alarmId) => {
    setShowSnoozeOptions(showSnoozeOptions === alarmId ? null : alarmId)
    setIsVisible(showSnoozeOptions !== alarmId)
  }

  const handleSnoozeSelect = (alarmId, minutes) => {
    snoozeAlarm(alarmId, minutes)
    setShowSnoozeOptions(null)
    setIsVisible(false)
  }

  if (activeAlarms.length === 0) return null

  return (
    <>
      <AnimatePresence>
        {activeAlarms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Bell className="w-4 h-4 text-red-600" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-red-800 text-lg flex items-center gap-2">
                        🚨 Deadline Alert!
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
                        >
                          {isAudioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                        </Button>
                      </CardTitle>
                      <p className="text-red-600 text-sm">
                        {activeAlarms.length} document{activeAlarms.length > 1 ? "s" : ""} need
                        {activeAlarms.length === 1 ? "s" : ""} attention
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissAllAlarms}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activeAlarms.map((alarm) => {
                    const daysLeft = getDaysUntilDeadline(alarm.document.deadline)
                    const urgency = getDeadlineUrgency(daysLeft)

                    return (
                      <motion.div
                        key={alarm.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border-2 ${urgency.bgColor} relative overflow-hidden`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 text-sm truncate">{alarm.document.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {alarm.document.type}
                              </Badge>
                              <div className={`flex items-center space-x-1 ${urgency.color}`}>
                                <CalendarDays className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  {daysLeft === 0
                                    ? "Due Today"
                                    : daysLeft === 1
                                      ? "Due Tomorrow"
                                      : `${daysLeft} days left`}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              Deadline: {new Date(alarm.document.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissAlarm(alarm.id, alarm.document.id)}
                            className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Animated progress bar */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-400 to-orange-400"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />

                        {/* Snooze Options */}
                        <div className="mt-3 relative">
                          <Button
                            ref={snoozeButtonRef}
                            size="sm"
                            variant="outline"
                            onClick={() => handleSnoozeClick(alarm.id)}
                            className="w-full text-xs h-8 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Snooze className="w-3 h-3 mr-1" />
                            Snooze
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>

                          <AnimatePresence>
                            {showSnoozeOptions === alarm.id && (
                              <motion.div
                                ref={snoozeMenuRef}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                style={{
                                  position: "fixed",
                                  ...position,
                                  zIndex: 9999,
                                }}
                                className="bg-white border border-slate-200 shadow-lg rounded-lg p-2 min-w-[160px]"
                              >
                                {SNOOZE_OPTIONS.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => handleSnoozeSelect(alarm.id, option.value)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center gap-2 transition-colors"
                                  >
                                    <span>{option.icon}</span>
                                    <span>{option.label}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    onClick={dismissAllAlarms}
                    className="flex-1 text-xs h-8 bg-red-600 hover:bg-red-700"
                  >
                    Dismiss All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close snooze menu */}
      {showSnoozeOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSnoozeOptions(null)
            setIsVisible(false)
          }}
        />
      )}
    </>
  )
}