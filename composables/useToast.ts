export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

/**
 * Toast notifications composable
 * Provides a simple notification system
 */
export const useToast = () => {
  const notifications = useState<Toast[]>('toast-notifications', () => [])

  const add = (
    message: string,
    type: Toast['type'] = 'success',
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration }

    notifications.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clear = () => {
    notifications.value = []
  }

  const success = (message: string, duration?: number) => add(message, 'success', duration)
  const error = (message: string, duration?: number) => add(message, 'error', duration)
  const info = (message: string, duration?: number) => add(message, 'info', duration)
  const warning = (message: string, duration?: number) => add(message, 'warning', duration)

  return {
    notifications: readonly(notifications),
    add,
    remove,
    clear,
    success,
    error,
    info,
    warning,
  }
}
