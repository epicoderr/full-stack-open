import { create } from 'zustand'

let timeoutId

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (message, type = 'success') => {
    clearTimeout(timeoutId)
    set({ notification: { message, type } })
    timeoutId = setTimeout(() => set({ notification: null }), 5000)
  },
  clearNotification: () => {
    clearTimeout(timeoutId)
    set({ notification: null })
  },
}))

export default useNotificationStore
