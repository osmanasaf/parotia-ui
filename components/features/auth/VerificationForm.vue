<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-center mb-6">
      <div class="text-4xl mb-4">📧</div>
      <h3 class="text-xl font-semibold text-white mb-2">Email Verification</h3>
      <p class="text-white/70">
        Enter the 6-digit verification code sent to {{ email }}
      </p>
    </div>

    <AuthInput
      id="verification-email"
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="ornek@email.com"
      required
      :error="errors.email"
    />

    <AuthInput
      id="verification-code"
      v-model="form.code"
      label="Verification Code"
      type="text"
      placeholder="123456"
      required
      :error="errors.code"
      hint="Enter the 6-digit code"
      maxlength="6"
    />

    <AuthButton
      type="submit"
      :loading="isLoading"
      :disabled="!isFormValid"
      loading-text="Verifying..."
    >
      Verify Email
    </AuthButton>

    <div class="text-center space-y-3">
      <button
        type="button"
        class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        @click="resendCode"
        :disabled="isResending"
      >
        {{ isResending ? 'Sending code...' : 'Resend code' }}
      </button>

      <div>
        <button
          type="button"
          class="text-sm text-white/70 hover:text-white transition-colors"
          @click="$emit('backToLogin')"
        >
          ← Back to sign in
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFormValidation } from '~/composables/useFormValidation'
import { AuthInput, AuthButton } from '~/components/ui'

const props = defineProps({
  email: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['success', 'error', 'backToLogin', 'showLogin'])

const { verifyEmail, sendVerificationCode, isLoading } = useAuth()
const { validateVerificationForm } = useFormValidation()

const form = ref({
  email: props.email,
  code: ''
})

const errors = ref({})
const isResending = ref(false)

const isFormValid = computed(() => {
  return form.value.email && 
         form.value.code && 
         form.value.code.length === 6 && 
         Object.keys(errors.value).length === 0
})

const handleSubmit = async () => {
  errors.value = validateVerificationForm(form.value)
  
  if (Object.keys(errors.value).length > 0) {
    emit('error', Object.values(errors.value)[0])
    return
  }

  const result = await verifyEmail(form.value.email, form.value.code)

  if (result.success) {
    emit('success', { 
      message: result.message || 'Your email has been verified successfully! You can sign in now.',
      email: result.email 
    })
    emit('showLogin', result.email)
  } else {
    emit('error', result.error)
  }
}

const resendCode = async () => {
  isResending.value = true
  
  try {
    const result = await sendVerificationCode(form.value.email)
    if (result.success) {
      emit('success', { message: 'Verification code sent again' })
    } else {
      emit('error', result.error)
    }
  } catch (error) {
    emit('error', 'An error occurred while sending the code')
  } finally {
    isResending.value = false
  }
}

// Form değişikliklerinde hataları temizle
watch(form, () => {
  if (Object.keys(errors.value).length > 0) {
    errors.value = {}
  }
}, { deep: true })

// Email prop'u değiştiğinde form'u güncelle
watch(() => props.email, (newEmail) => {
  form.value.email = newEmail
})

// Modal açıldığında otomatik doğrulama kodu gönder
onMounted(async () => {
  if (!form.value.email) return
  isResending.value = true
  try {
    await sendVerificationCode(form.value.email)
  } catch (error) {
    emit('error', 'An error occurred while sending the code')
  } finally {
    isResending.value = false
  }
})
</script> 