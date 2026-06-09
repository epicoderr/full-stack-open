import { Alert } from '@mui/material'
import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const notification = useNotificationStore((state) => state.notification)

  if (!notification) {
    return null
  }

  return (
    <Alert
      className={notification.type === 'error' ? 'error' : 'success'}
      severity={notification.type}
      sx={{ my: 2 }}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification
