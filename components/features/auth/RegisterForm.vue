<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AuthInput
        id="register-first-name"
        v-model="form.first_name"
        label="First name"
        type="text"
        placeholder="First name (optional)"
        :error="errors.first_name"
        @keyup-enter="handleSubmit"
      />
      <AuthInput
        id="register-last-name"
        v-model="form.last_name"
        label="Last name"
        type="text"
        placeholder="Last name (optional)"
        :error="errors.last_name"
        @keyup-enter="handleSubmit"
      />
    </div>
    <AuthInput
      id="register-username"
      v-model="form.username"
      label="Username"
      type="text"
      placeholder="kullanici_adi"
      required
      :error="errors.username"
      hint="Only letters, numbers and underscore are allowed"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="register-email"
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="ornek@email.com"
      required
      :error="errors.email"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="register-password"
      v-model="form.password"
      label="Password"
      type="password"
      placeholder="Create a strong password"
      required
      :error="errors.password"
      hint="At least 8 characters, include upper/lowercase and numbers"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="register-confirm-password"
      v-model="form.confirmPassword"
      label="Confirm password"
      type="password"
      placeholder="Re-enter your password"
      required
      :error="errors.confirmPassword"
      @keyup-enter="handleSubmit"
    />

    <div class="flex items-center">
      <input
        id="accept-terms"
        v-model="form.acceptTerms"
        type="checkbox"
        required
        class="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
      />
      <label class="ml-2 text-sm text-white/70" for="accept-terms">
        I accept the <a href="/terms" class="text-blue-400 hover:text-blue-300">Terms of Service</a>
        and <a href="/privacy" class="text-blue-400 hover:text-blue-300">Privacy Policy</a>
      </label>
    </div>

    <AuthButton
      type="submit"
      :loading="isLoading"
      :disabled="!isFormValid"
      loading-text="Creating account..."
    >
      Create Account
    </AuthButton>

    <div class="text-center">
      <p class="text-white/70" id="login-link-desc">Already have an account?</p>
      <button
        type="button"
        class="text-blue-400 hover:text-blue-300 transition-colors font-medium"
        @click="$emit('showLogin')"
        aria-describedby="login-link-desc"
      >
        Sign in
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFormValidation } from '~/composables/useFormValidation'
import { AuthInput, AuthButton } from '~/components/ui'

const emit = defineEmits(['success', 'error', 'showLogin'])

const { register, isLoading } = useAuth()
const { validateRegisterForm } = useFormValidation()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  first_name: '',
  last_name: '',
  acceptTerms: false
})

const errors = ref({})

const isFormValid = computed(() => {
  return form.value.username && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword && 
         form.value.acceptTerms && 
         Object.keys(errors.value).length === 0
})

const handleSubmit = async () => {
  errors.value = validateRegisterForm(form.value)
  
  if (Object.keys(errors.value).length > 0) {
    emit('error', Object.values(errors.value)[0])
    return
  }

  const result = await register({
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    first_name: form.value.first_name || undefined,
    last_name: form.value.last_name || undefined
  })

  if (result.success) {
    emit('success', result.user)
  } else {
    emit('error', result.error)
  }
}

// Form değişikliklerinde hataları temizle - sadece input değişikliklerinde
const clearErrors = () => {
  if (Object.keys(errors.value).length > 0) {
    errors.value = {}
  }
}
</script> 