import { AUTH_CONSTANTS, VALIDATION_RULES } from '~/constants'

export const useFormValidation = () => {
  const validateField = (value, rules) => {
    const errors = []

    if (rules.required && !value) {
      errors.push('Bu alan gereklidir')
      return errors
    }

    if (value) {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`En az ${rules.minLength} karakter olmalıdır`)
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`En fazla ${rules.maxLength} karakter olabilir`)
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.message || 'Geçersiz format')
      }
    }

    return errors
  }

  const validateEmail = (email) => {
    return validateField(email, VALIDATION_RULES.email)
  }

  const validatePassword = (password) => {
    return validateField(password, VALIDATION_RULES.password)
  }

  const validateLoginPassword = (password) => {
    // Login için sadece required kontrolü
    return validateField(password, { required: true })
  }

  const validateUsername = (username) => {
    return validateField(username, VALIDATION_RULES.username)
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return [AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORDS_DONT_MATCH]
    }
    return []
  }

  const validateLoginForm = (form) => {
    const errors = {}

    const emailErrors = validateEmail(form.email)
    if (emailErrors.length > 0) {
      errors.email = emailErrors[0]
    }

    const passwordErrors = validateLoginPassword(form.password)
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0]
    }

    return errors
  }

  const validateRegisterForm = (form) => {
    const errors = {}

    const emailErrors = validateEmail(form.email)
    if (emailErrors.length > 0) {
      errors.email = emailErrors[0]
    }

    const usernameErrors = validateUsername(form.username)
    if (usernameErrors.length > 0) {
      errors.username = usernameErrors[0]
    }

    const passwordErrors = validatePassword(form.password)
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0]
    }

    const confirmPasswordErrors = validateConfirmPassword(form.password, form.confirmPassword)
    if (confirmPasswordErrors.length > 0) {
      errors.confirmPassword = confirmPasswordErrors[0]
    }

    return errors
  }

  const validateVerificationForm = (form) => {
    const errors = {}

    const emailErrors = validateEmail(form.email)
    if (emailErrors.length > 0) {
      errors.email = emailErrors[0]
    }

    if (!form.code || form.code.length !== 6) {
      errors.code = 'Doğrulama kodu 6 haneli olmalıdır'
    }

    return errors
  }

  return {
    validateField,
    validateEmail,
    validatePassword,
    validateLoginPassword,
    validateUsername,
    validateConfirmPassword,
    validateLoginForm,
    validateRegisterForm,
    validateVerificationForm
  }
} 