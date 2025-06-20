import { useContext } from "react"
import { AlarmContext } from "../components/global-alarm-provider"

export function useGlobalAlarm() {
  const context = useContext(AlarmContext)
  if (!context) {
    throw new Error("useGlobalAlarm must be used within AlarmProvider")
  }
  return context
}
