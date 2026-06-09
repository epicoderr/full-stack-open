import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUser from '../services/persistentUser'
import useNotificationStore from './notificationStore'

const useUserStore = create((set) => ({
  user: null,
  initializeUser: () => {
    const storedUser = persistentUser.getUser()

    if (storedUser) {
      blogService.setToken(storedUser.token)
      set({ user: storedUser })
    }
  },
  login: async (credentials) => {
    const loggedUser = await loginService.login(credentials)
    persistentUser.saveUser(loggedUser)
    blogService.setToken(loggedUser.token)
    set({ user: loggedUser })
    useNotificationStore
      .getState()
      .setNotification(`welcome ${loggedUser.name}`)
    return loggedUser
  },
  logout: () => {
    persistentUser.removeUser()
    blogService.clearToken()
    set({ user: null })
    useNotificationStore.getState().setNotification('logged out')
  },
}))

export default useUserStore
