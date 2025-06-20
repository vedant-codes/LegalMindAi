"use client"

import { createContext } from "react"
import { useAlarmSystem } from "../hooks/use-alarm-system"
import { DeadlineAlarmPopup } from "./deadline-alarm-popup"

export const AlarmContext = createContext(null)

export function AlarmProvider({ children }) {
  const alarmSystem = useAlarmSystem()

  return (
    <AlarmContext.Provider value={alarmSystem}>
      {children}
      <DeadlineAlarmPopup />
    </AlarmContext.Provider>
  )
}
