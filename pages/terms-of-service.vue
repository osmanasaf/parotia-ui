<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <main class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: {{ lastUpdated }}</p>

      <h2>Acceptance of Terms</h2>
      <p>By using movAi, you agree to be bound by these terms.</p>

      <h2>Use of Service</h2>
      <ul>
        <li>You must be at least 13 years old to use the service.</li>
        <li>Do not misuse the platform or attempt to disrupt its operation.</li>
        <li>Respect intellectual property and other users.</li>
      </ul>

      <h2>Accounts</h2>
      <p>You are responsible for safeguarding your account and promptly notifying us of any breach.</p>

      <h2>Content</h2>
      <p>We display information from third-party sources. We do not guarantee accuracy or availability.</p>

      <h2>Termination</h2>
      <p>We may suspend or terminate accounts that violate these terms.</p>

      <h2>Changes</h2>
      <p>We may update these terms. Continued use constitutes acceptance of changes.</p>

      <h2>Contact</h2>
      <p>For questions about these terms, contact us via the help section.</p>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
const lastUpdated = new Date().toISOString().slice(0, 10)
useHead({ 
  title: 'Terms of Service',
  meta: [
    { name: 'description', content: 'movAi terms of service and acceptable use.' }
  ]
})
</script>

<style scoped>
.prose :where(a):not(:where(.not-prose *)) { color: #93c5fd; }
</style>


