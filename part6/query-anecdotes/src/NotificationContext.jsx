import { createContext, useReducer, useRef } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)
  const timeoutRef = useRef(null)

  const notify = (message, type = 'success') => {
    clearTimeout(timeoutRef.current)

    dispatch({
      type: 'SET',
      payload: { message, type },
    })

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext