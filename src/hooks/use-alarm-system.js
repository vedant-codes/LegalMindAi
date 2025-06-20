"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export const SNOOZE_OPTIONS = [
  { label: "5 minutes", value: 5, icon: "⏰" },
  { label: "10 minutes", value: 10, icon: "⏱️" },
  { label: "15 minutes", value: 15, icon: "⏲️" },
  { label: "30 minutes", value: 30, icon: "🕐" },
  { label: "1 hour", value: 60, icon: "🕑" },
]

export function useAlarmSystem() {
  const [activeAlarms, setActiveAlarms] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/mixkit-software-interface-back-2575.wav")
      audioRef.current.loop = false
    }
  }, [])

  const playAlarmSound = useCallback(() => {
    if (isAudioEnabled && audioRef.current) {
      audioRef.current.play().catch((err) => console.error("Alarm play error:", err))
    }
  }, [isAudioEnabled])

  const checkUrgentDocuments = useCallback((documents) => {
    const now = Date.now()
    setActiveAlarms((prevAlarms) => {
      const newAlarms = [...prevAlarms]
      const existingDocIds = new Set(prevAlarms.map((alarm) => alarm.document.id))

      documents.forEach((doc) => {
        if (!doc.deadline || dismissedAlerts.has(doc.id)) return

        const deadlineTime = new Date(doc.deadline).getTime()
        const daysLeft = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24))

        if (daysLeft <= 3 && daysLeft >= 0 && !existingDocIds.has(doc.id)) {
          newAlarms.push({
            id: `alarm_${doc.id}_${now}`,
            document: doc,
            isActive: true,
            createdAt: now,
          })
        }
      })

      return newAlarms
    })
  }, [dismissedAlerts])

  const snoozeAlarm = useCallback((alarmId, minutes) => {
    const snoozeUntil = Date.now() + minutes * 60 * 1000
    setActiveAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, snoozeUntil, isActive: false } : alarm
      )
    )
  }, [])

  const dismissAlarm = useCallback((alarmId, documentId) => {
    setActiveAlarms((prev) => prev.filter((alarm) => alarm.id !== alarmId))
    if (documentId) {
      setDismissedAlerts((prev) => new Set(prev).add(documentId))
    }
  }, [])

  const dismissAllAlarms = useCallback(() => {
    setDismissedAlerts((prev) => {
      const updated = new Set(prev)
      activeAlarms.forEach((alarm) => updated.add(alarm.document.id))
      return updated
    })
    setActiveAlarms([])
  }, [activeAlarms])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now()
      setActiveAlarms((prev) =>
        prev.map((alarm) => {
          if (!alarm.isActive && alarm.snoozeUntil && now >= alarm.snoozeUntil) {
            playAlarmSound()
            return { ...alarm, isActive: true, snoozeUntil: undefined }
          }
          return alarm
        })
      )
    }, 30000)

    return () => clearInterval(intervalRef.current)
  }, [playAlarmSound])

  const getActiveAlarms = useCallback(() => {
    return activeAlarms.filter((alarm) => alarm.isActive)
  }, [activeAlarms])

  return {
    activeAlarms: getActiveAlarms(),
    checkUrgentDocuments,
    snoozeAlarm,
    dismissAlarm,
    dismissAllAlarms,
    isAudioEnabled,
    setIsAudioEnabled,
    playAlarmSound,
  }
}
