<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="onClose">
    <div class="absolute inset-0 bg-black/70"></div>
    <div class="relative w-full max-w-md bg-gray-900/95 border border-white/20 rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Yeni E-postayı Doğrula</h3>
        <button class="text-white/70 hover:text-white" @click="onClose" aria-label="Close">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="space-y-4">
        <p class="text-white/70 text-sm"><span class="text-white font-medium">{{ newEmail }}</span> adresine gönderilen 6 haneli kodu girin.</p>
        <AuthInput id="email-change-code" v-model="code" label="Doğrulama Kodu" placeholder="123456" :maxlength="6" inputmode="numeric" @input="onCodeInput" />
        <div class="flex gap-2">
          <AuthButton :loading="loading" @click="verify">Doğrula</AuthButton>
          <AuthButton variant="secondary" :loading="resending" @click="resend">Tekrar Gönder</AuthButton>
          <AuthButton variant="secondary" @click="onClose">Vazgeç</AuthButton>
        </div>
        <p v-if="message" :class="messageClass">{{ message }}</p>
      </div>
    </div>
  </div>
  </template>

<script setup>
import { ref, computed } from 'vue'
import { AuthInput, AuthButton } from '~/components/ui'

const props = defineProps({
  open: { type: Boolean, default: false },
  newEmail: { type: String, required: true }
})

const emit = defineEmits(['close', 'verify', 'resend'])

const code = ref('')
const loading = ref(false)
const resending = ref(false)
const message = ref('')
const isError = ref(false)

const messageClass = computed(() => isError.value ? 'text-red-400' : 'text-yellow-300')

const onClose = () => emit('close')

const onCodeInput = (e) => {
  // keep only digits, max 6
  const digits = String(e?.target?.value ?? code.value).replace(/\D/g, '').slice(0, 6)
  code.value = digits
}

const verify = async () => {
  message.value = ''
  loading.value = true
  try {
    await emit('verify', { code: code.value })
  } finally {
    loading.value = false
  }
}

const resend = async () => {
  resending.value = true
  try {
    await emit('resend')
  } finally {
    resending.value = false
  }
}

defineExpose({ setMessage: (text, error = false) => { message.value = text; isError.value = error } })
</script>
