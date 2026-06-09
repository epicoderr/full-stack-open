import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

export const useNotification = () => {
  const context = useContext(NotificationContext)
  return context.notification
}

export const useNotify = () => {
  const context = useContext(NotificationContext)
  return context.notify
}