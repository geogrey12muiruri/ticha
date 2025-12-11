/**
 * Authentication Validators
 * Form validation schemas and utilities
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

export class AuthValidator {
  static validateEmail(email: string): ValidationResult {
    if (!email) {
      return { valid: false, error: 'Email is required' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Please enter a valid email address' }
    }

    return { valid: true }
  }

  static validatePassword(password: string, minLength: number = 6): ValidationResult {
    if (!password) {
      return { valid: false, error: 'Password is required' }
    }

    if (password.length < minLength) {
      return { valid: false, error: `Password must be at least ${minLength} characters` }
    }

    return { valid: true }
  }

  static validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return { valid: false, error: 'Passwords do not match' }
    }

    return { valid: true }
  }

  static validateSignUp(email: string, password: string): ValidationResult {
    const emailValidation = this.validateEmail(email)
    if (!emailValidation.valid) {
      return emailValidation
    }

    const passwordValidation = this.validatePassword(password)
    if (!passwordValidation.valid) {
      return passwordValidation
    }

    return { valid: true }
  }

  static validateSignIn(email: string, password: string): ValidationResult {
    return this.validateSignUp(email, password) // Same validation
  }

  static validatePasswordReset(password: string, confirmPassword: string): ValidationResult {
    const passwordValidation = this.validatePassword(password)
    if (!passwordValidation.valid) {
      return passwordValidation
    }

    return this.validatePasswordMatch(password, confirmPassword)
  }
}




