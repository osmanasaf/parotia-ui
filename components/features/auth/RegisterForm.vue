<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AuthInput
        id="register-first-name"
        v-model="form.first_name"
        label="Ad"
        type="text"
        placeholder="Ad (opsiyonel)"
        :error="errors.first_name"
        @keyup-enter="handleSubmit"
      />
      <AuthInput
        id="register-last-name"
        v-model="form.last_name"
        label="Soyad"
        type="text"
        placeholder="Soyad (opsiyonel)"
        :error="errors.last_name"
        @keyup-enter="handleSubmit"
      />
    </div>
    <AuthInput
      id="register-username"
      v-model="form.username"
      label="Kullanıcı adı"
      type="text"
      placeholder="kullanici_adi"
      required
      :error="errors.username"
      hint="Sadece harf, rakam ve alt çizgi kullanılabilir"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="register-email"
      v-model="form.email"
      label="E-posta"
      type="email"
      placeholder="ornek@email.com"
      required
      :error="errors.email"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="register-password"
      v-model="form.password"
      label="Şifre"
      type="password"
      placeholder="Güçlü bir şifre oluşturun"
      required
      :error="errors.password"
      hint="En az 8 karakter; büyük/küçük harf ve rakam içermeli"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="register-confirm-password"
      v-model="form.confirmPassword"
      label="Şifreyi doğrula"
      type="password"
      placeholder="Şifrenizi tekrar girin"
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
        <a href="/terms-of-service" class="text-blue-400 hover:text-blue-300">Hizmet Koşulları</a> ve
        <a href="/privacy-policy" class="text-blue-400 hover:text-blue-300">Gizlilik Politikası</a>'nı kabul ediyorum
      </label>
    </div>

    <AuthButton
      type="submit"
      :loading="isLoading"
      :disabled="!isFormValid"
      loading-text="Hesap oluşturuluyor..."
    >
      Hesap Oluştur
    </AuthButton>

    <div class="text-center">
      <p class="text-white/70" id="login-link-desc">Zaten bir hesabınız var mı?</p>
      <button
        type="button"
        class="text-blue-400 hover:text-blue-300 transition-colors font-medium"
        @click="$emit('showLogin')"
        aria-describedby="login-link-desc"
      >
        Giriş yap
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