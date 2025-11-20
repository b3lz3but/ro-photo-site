/**
 * Focus management composable
 * Provides utilities for managing keyboard focus and focus trapping
 */
export const useFocusManagement = () => {
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  /**
   * Get all focusable elements within a container
   */
  const getFocusableElements = (element: HTMLElement): HTMLElement[] => {
    return Array.from(element.querySelectorAll(focusableSelector))
  }

  /**
   * Trap focus within an element (useful for modals, menus)
   */
  const trapFocus = (element: HTMLElement) => {
    const focusable = getFocusableElements(element)
    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement?.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement?.focus()
        e.preventDefault()
      }
    }

    element.addEventListener('keydown', handleKeyDown)

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }

  /**
   * Focus the first focusable element
   */
  const focusFirst = (element: HTMLElement) => {
    const focusable = getFocusableElements(element)
    focusable[0]?.focus()
  }

  /**
   * Save current focus and restore it later
   */
  const useFocusReturn = () => {
    let previouslyFocused: HTMLElement | null = null

    const save = () => {
      previouslyFocused = document.activeElement as HTMLElement
    }

    const restore = () => {
      previouslyFocused?.focus()
      previouslyFocused = null
    }

    return { save, restore }
  }

  return {
    getFocusableElements,
    trapFocus,
    focusFirst,
    useFocusReturn,
  }
}
