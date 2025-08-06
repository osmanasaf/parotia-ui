<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-center mb-6">
      <div class="text-4xl mb-4">📧</div>
      <h3 class="text-xl font-semibold text-white mb-2">Email Doğrulama</h3>
      <p class="text-white/70">
        {{ email }} adresine gönderilen 6 haneli doğrulama kodunu girin
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
      label="Doğrulama Kodu"
      type="text"
      placeholder="123456"
      required
      :error="errors.code"
      hint="6 haneli kodu girin"
      maxlength="6"
    />

    <AuthButton
      type="submit"
      :loading="isLoading"
      :disabled="!isFormValid"
      loading-text="Doğrulanıyor..."
    >
      Email'i Doğrula
    </AuthButton>

    <div class="text-center space-y-3">
      <button
        type="button"
        class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        @click="resendCode"
        :disabled="isResending"
      >
        {{ isResending ? 'Kod gönderiliyor...' : 'Kodu tekrar gönder' }}
      </button>

      <div>
        <button
          type="button"
          class="text-sm text-white/70 hover:text-white transition-colors"
          @click="$emit('backToLogin')"
        >
          ← Giriş sayfasına dön
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
    // Başarılı doğrulama sonrası login formuna yönlendir
    emit('success', { 
      message: result.message || 'Email adresiniz başarıyla doğrulandı! Giriş yapabilirsiniz.',
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
      emit('success', { message: 'Doğrulama kodu tekrar gönderildi' })
    } else {
      emit('error', result.error)
    }
  } catch (error) {
    emit('error', 'Kod gönderilirken hata oluştu')
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
</script> 