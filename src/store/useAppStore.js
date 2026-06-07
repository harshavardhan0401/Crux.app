import { create } from 'zustand'
import { STUDENTS, CURRENT_USER_ID } from '../data/students'
import { NOTIFICATIONS as INITIAL_NOTIFICATIONS } from '../data/notifications'

const CURRENT_USER = STUDENTS.find(s => s.id === CURRENT_USER_ID)

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('crux-theme')
  if (stored) return stored
  return 'dark'
}

const getInitialOnboarded = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('crux-onboarded') === 'true'
}

const useAppStore = create((set, get) => ({
  isLoggedIn: false,
  isOnboarded: getInitialOnboarded(),
  user: null,

  login: (userData) => set({
    isLoggedIn: true,
    user: userData || { ...CURRENT_USER }
  }),

  logout: () => {
    localStorage.removeItem('crux-onboarded')
    set({
      isLoggedIn: false,
      isOnboarded: false,
      user: null,
    })
  },

  setOnboarded: () => {
    localStorage.setItem('crux-onboarded', 'true')
    set({ isOnboarded: true })
  },

  updateUser: (data) => set(state => ({
    user: { ...state.user, ...data }
  })),

  theme: getInitialTheme(),
  toggleTheme: () => set(state => {
    const next = state.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('crux-theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return { theme: next }
  }),

  notifications: INITIAL_NOTIFICATIONS.map(n => ({ ...n })),

  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),

  markRead: (id) => set(state => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    )
  })),

  get unreadCount() {
    return get().notifications.filter(n => !n.isRead).length
  },

  getUnreadCount: () => get().notifications.filter(n => !n.isRead).length,

  toasts: [],

  addToast: (message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    set(state => ({
      toasts: [...state.toasts, { id, message, type }]
    }))
    setTimeout(() => {
      get().removeToast(id)
    }, 3000)
  },

  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}))

export default useAppStore
export { CURRENT_USER }
