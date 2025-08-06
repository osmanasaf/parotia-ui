<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <AuthInput
      id="register-username"
      v-model="form.username"
      label="Kullanıcı Adı"
      type="text"
      placeholder="kullanici_adi"
      required
      :error="errors.username"
      hint="Sadece harf, rakam ve alt çizgi kullanabilirsiniz"
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
      label="Şifre"
      type="password"
      placeholder="Güçlü bir şifre oluşturun"
      required
      :error="errors.password"
      hint="En az 8 karakter, büyük/küçük harf ve rakam içermeli"
      @keyup-enter="handleSubmit"
    />

    <AuthInput
      id="register-confirm-password"
      v-model="form.confirmPassword"
      label="Şifre Tekrar"
      type="password"
      placeholder="Şifrenizi tekrar girin"
      required
      :error="errors.confirmPassword"
      @keyup-enter="handleSubmit"
    />

    <div class="flex items-center">
      <input
        v-model="form.acceptTerms"
        type="checkbox"
        required
        class="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
      />
      <label class="ml-2 text-sm text-white/70">
        <a href="/terms" class="text-blue-400 hover:text-blue-300">Kullanım şartlarını</a>
        ve
        <a href="/privacy" class="text-blue-400 hover:text-blue-300">gizlilik politikasını</a>
        kabul ediyorum
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
      <p class="text-white/70">
        Zaten hesabınız var mı?
        <button
          type="button"
          class="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          @click="$emit('showLogin')"
        >
          Giriş yap
        </button>
      </p>
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
    password: form.value.password
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