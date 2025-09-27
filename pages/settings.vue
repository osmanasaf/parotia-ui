<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <div class="max-w-3xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-semibold text-white mb-6">Account Settings</h2>

      <div class="space-y-8">
        <!-- Profile Information -->
        <form @submit.prevent="submitProfile" class="card-modern p-6 space-y-4">
          <h3 class="text-white font-semibold text-lg">Profile</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput id="settings-first-name" v-model="profile.first_name" label="First name" type="text" placeholder="First name" />
            <AuthInput id="settings-last-name" v-model="profile.last_name" label="Last name" type="text" placeholder="Last name" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput id="settings-username" v-model="profile.username" label="Username" type="text" placeholder="username" :disabled="true" />
            <div class="flex flex-col gap-2">
              <div class="relative">
                <AuthInput
                  id="settings-email"
                  v-model="profile.email"
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  :disabled="!isEmailEditing"
                />
                <button
                  type="button"
                  class="absolute right-3 top-9 h-7 w-7 rounded bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                  @click="toggleEmailEdit"
                  :title="isEmailEditing ? 'Cancel editing' : 'Edit email'"
                >
                  <svg v-if="!isEmailEditing" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l9.414-9.414a2 2 0 000-2.828l-2.172-2.172a2 2 0 00-2.828 0L4.293 14.707A1 1 0 004 15.414V20z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  v-if="canConfirmEmail && !awaitingEmailCode"
                  type="button"
                  class="absolute right-12 top-9 h-7 w-7 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center"
                  @click="submitEmailChange"
                  title="Confirm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div v-if="awaitingEmailCode" class="flex items-end gap-2">
                <AuthInput id="settings-email-code" v-model="emailCode" label="Verification Code" type="text" placeholder="123456" />
                <AuthButton type="button" :loading="isLoading" @click="confirmEmailChangeAction">Verify</AuthButton>
                <AuthButton type="button" :loading="isLoading" @click="resendEmailCode" variant="outline">Resend</AuthButton>
                <AuthButton type="button" variant="outline" @click="cancelEmailEdit">Cancel</AuthButton>
              </div>
              <p v-if="emailInfoMessage" class="text-yellow-300 text-sm">{{ emailInfoMessage }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <AuthButton type="submit" :loading="isLoading" :disabled="!canSubmitProfile">Update</AuthButton>
            <p v-if="saveMessage" class="text-green-400 self-center">{{ saveMessage }}</p>
            <p v-if="error" class="text-red-400 self-center">{{ error }}</p>
          </div>
          <p v-if="emailVerificationHint" class="text-yellow-300 text-sm">{{ emailVerificationHint }}</p>
        </form>

        <!-- Change Password -->
        <form @submit.prevent="submitPassword" class="card-modern p-6 space-y-4">
          <h3 class="text-white font-semibold text-lg">Password</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput id="settings-current-password" v-model="passwordForm.current_password" label="Current password" type="password" placeholder="********" />
            <AuthInput id="settings-new-password" v-model="passwordForm.new_password" label="New password" type="password" placeholder="********" />
          </div>
          <div class="flex gap-3">
            <AuthButton type="submit" :loading="isLoading" :disabled="!canSubmitPassword">Update Password</AuthButton>
            <p v-if="passwordMessage" class="text-green-400 self-center">{{ passwordMessage }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>
  <EmailChangeModal
    :open="emailModalOpen"
    :newEmail="profile.email"
    @close="emailModalOpen = false"
    @verify="onModalVerify"
    @resend="resendEmailCode"
  />
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
import { AuthInput, AuthButton, EmailChangeModal } from '~/components/ui'
import { useSearchStore } from '~/stores/search'
import { useAuth } from '~/composables/useAuth'

const { currentUser, isLoading, error, getCurrentUser, updateProfile, changePassword, requestEmailChange, confirmEmailChange } = useAuth()

const profile = ref({
  email: '',
  username: '',
  first_name: '',
  last_name: ''
})
const originalProfile = ref({ email: '', username: '', first_name: '', last_name: '' })

const passwordForm = ref({ current_password: '', new_password: '' })
const isEmailEditing = ref(false)
const awaitingEmailCode = ref(false)
const emailCode = ref('')
const emailInfoMessage = ref('')
const emailModalOpen = ref(false)

const saveMessage = ref('')
const passwordMessage = ref('')
const emailVerificationHint = ref('')

onMounted(async () => {
  // Close expanding search on settings
  const searchStore = useSearchStore()
  if (searchStore.isExpandingSearchExpanded) {
    searchStore.resetSearch()
  }

  if (!currentUser.value || !currentUser.value.email) {
    await getCurrentUser()
  }
  const u = currentUser.value || {}
  profile.value = {
    email: u.email || '',
    username: u.username || '',
    first_name: u.first_name || '',
    last_name: u.last_name || ''
  }
  originalProfile.value = { ...profile.value }
})

const submitProfile = async () => {
  saveMessage.value = ''
  emailVerificationHint.value = ''
  const res = await updateProfile({
    // Do not send email or username; email change has its own flow and username is immutable
    first_name: profile.value.first_name || undefined,
    last_name: profile.value.last_name || undefined
  })
  if (res.success) {
    saveMessage.value = res.message
    // Email changes are handled via dedicated flow
    originalProfile.value = {
      email: res.user.email || '',
      username: res.user.username || '',
      first_name: res.user.first_name || '',
      last_name: res.user.last_name || ''
    }
  }
}

const submitPassword = async () => {
  passwordMessage.value = ''
  const res = await changePassword({
    current_password: passwordForm.value.current_password,
    new_password: passwordForm.value.new_password
  })
  if (res.success) {
    passwordMessage.value = res.message
    passwordForm.value.current_password = ''
    passwordForm.value.new_password = ''
  }
}

const isProfileValid = computed(() => true)
const isDirtyProfile = computed(() => {
  return (
    profile.value.first_name !== originalProfile.value.first_name ||
    profile.value.last_name !== originalProfile.value.last_name
  )
})
const canSubmitProfile = computed(() => isProfileValid.value && isDirtyProfile.value && !isLoading.value)

const canSubmitPassword = computed(() => {
  return (
    (passwordForm.value.current_password || '').length > 0 &&
    (passwordForm.value.new_password || '').length >= 8 &&
    !isLoading.value
  )
})

// Email change flow helpers
const toggleEmailEdit = () => {
  isEmailEditing.value = !isEmailEditing.value
  emailInfoMessage.value = ''
  awaitingEmailCode.value = false
  emailCode.value = ''
}

const canConfirmEmail = computed(() => {
  return isEmailEditing.value && profile.value.email && profile.value.email !== originalProfile.value.email
})

const submitEmailChange = async () => {
  emailInfoMessage.value = ''
  const res = await requestEmailChange(profile.value.email)
  if (res.success) {
    emailInfoMessage.value = res.message
    emailModalOpen.value = true
    awaitingEmailCode.value = true
  } else {
    emailInfoMessage.value = res.error
  }
}

const confirmEmailChangeAction = async () => {
  const res = await confirmEmailChange({ new_email: profile.value.email, code: emailCode.value })
  if (res.success) {
    originalProfile.value.email = res.user.email
    isEmailEditing.value = false
    awaitingEmailCode.value = false
    emailInfoMessage.value = res.message
    emailModalOpen.value = false
  } else {
    emailInfoMessage.value = res.error
  }
}

const resendEmailCode = async () => {
  await submitEmailChange()
}

const cancelEmailEdit = () => {
  isEmailEditing.value = false
  awaitingEmailCode.value = false
  emailCode.value = ''
  profile.value.email = originalProfile.value.email
  emailInfoMessage.value = ''
  emailModalOpen.value = false
}

const onModalVerify = async (e) => {
  emailCode.value = e?.code || ''
  await confirmEmailChangeAction()
}
</script>

<style scoped>
.card-modern { /* mevcut global sınıfla uyumlu boş stil bloğu, linter için içerik */ }
</style>


