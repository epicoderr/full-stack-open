import { useNotification } from '../hooks/useNotification'

const Notification = () => {
  const notification = useNotification()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    color: notification?.type === 'error' ? 'red' : 'green',
  }

  if (!notification) {
    return null
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
