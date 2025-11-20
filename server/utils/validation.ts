/**
 * Server-side validation utilities
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic international format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string, maxLength = 1000): string => {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

/**
 * Validate contact form data
 */
export const validateContactForm = (data: any): ValidationResult => {
  const errors: string[] = []

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required')
  } else if (data.name.length < 2 || data.name.length > 100) {
    errors.push('Name must be between 2 and 100 characters')
  }

  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email address')
  }

  // Validate subject (optional)
  if (data.subject && typeof data.subject === 'string' && data.subject.length > 200) {
    errors.push('Subject must be less than 200 characters')
  }

  // Validate message
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required')
  } else if (data.message.length < 10) {
    errors.push('Message must be at least 10 characters')
  } else if (data.message.length > 5000) {
    errors.push('Message must be less than 5000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Rate limiting helper
 */
export const createRateLimiter = () => {
  const attempts = new Map<string, number[]>()
  const maxAttempts = 5
  const windowMs = 15 * 60 * 1000 // 15 minutes

  return {
    check: (identifier: string): boolean => {
      const now = Date.now()
      const userAttempts = attempts.get(identifier) || []

      // Filter out old attempts
      const recentAttempts = userAttempts.filter(time => now - time < windowMs)

      if (recentAttempts.length >= maxAttempts) {
        return false
      }

      // Add current attempt
      recentAttempts.push(now)
      attempts.set(identifier, recentAttempts)

      return true
    },
  }
}
