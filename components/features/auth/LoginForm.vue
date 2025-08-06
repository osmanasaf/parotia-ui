<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <AuthInput
      id="login-email"
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="ornek@email.com"
      required
      :error="errors.email"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="login-password"
      v-model="form.password"
      label="Şifre"
      type="password"
      placeholder="Şifrenizi girin"
      required
      :error="errors.password"
      @keyup-enter="handleSubmit"
    />

    <div class="flex items-center justify-between">
      <label class="flex items-center">
        <input
          v-model="form.rememberMe"
          type="checkbox"
          class="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
        />
        <span class="ml-2 text-sm text-white/70">Beni hatırla</span>
      </label>
      
      <button
        type="button"
        class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        @click="$emit('forgotPassword')"
      >
        Şifremi unuttum
      </button>
    </div>

    <AuthButton
      type="submit"
      :loading="isLoading"
      :disabled="!isFormValid"
      loading-text="Giriş yapılıyor..."
    >
      Giriş Yap
    </AuthButton>

    <div class="text-center">
      <p class="text-white/70">
        Hesabınız yok mu?
        <button
          type="button"
          class="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          @click="$emit('showRegister')"
        >
          Hesap oluştur
        </button>
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFormValidation } from '~/composables/useFormValidation'
import { AuthInput, AuthButton } from '~/components/ui'

const emit = defineEmits(['success', 'error', 'showRegister', 'forgotPassword', 'showVerification'])

const { login, isLoading } = useAuth()
const { validateLoginForm } = useFormValidation()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref({})

const isFormValid = computed(() => {
  return form.value.email && form.value.password && Object.keys(errors.value).length === 0
})

const handleSubmit = async () => {
  errors.value = validateLoginForm(form.value)
  
  if (Object.keys(errors.value).length > 0) {
    emit('error', Object.values(errors.value)[0])
    return
  }

  const result = await login({
    email: form.value.email,
    password: form.value.password
  })

  if (result.success) {
    emit('success', result.user)
  } else {
    // Email doğrulanmamış hatası kontrolü
    if (result.requiresVerification) {
      emit('showVerification', result.email)
    } else {
      emit('error', result.error)
    }
  }
}

// Form değişikliklerinde hataları temizle
watch(form, () => {
  if (Object.keys(errors.value).length > 0) {
    errors.value = {}
  }
}, { deep: true })
</script> 