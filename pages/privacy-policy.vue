<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <main class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {{ lastUpdated }}</p>

      <p>
        We value your privacy. This policy explains what information we collect, how we use it,
        and your rights regarding your data.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Account data: email, username, basic profile details</li>
        <li>Usage data: pages visited, interactions with recommendations</li>
        <li>Technical data: device, browser, and approximate location</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>Provide personalized movie/TV recommendations</li>
        <li>Improve our services and user experience</li>
        <li>Maintain security and prevent abuse</li>
      </ul>

      <h2>Data Retention</h2>
      <p>We keep data only as long as necessary for the purposes above or as required by law.</p>

      <h2>Your Rights</h2>
      <ul>
        <li>Access, update, or delete your data</li>
        <li>Export your data</li>
        <li>Withdraw consent where applicable</li>
      </ul>

      <h2>Contact</h2>
      <p>If you have questions about this policy, contact us via the help section.</p>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
const lastUpdated = new Date().toISOString().slice(0, 10)
useHead({ 
  title: 'Privacy Policy',
  meta: [
    { name: 'description', content: 'movAi privacy policy: what we collect, how we use it, and your rights.' }
  ]
})
</script>

<style scoped>
.prose :where(a):not(:where(.not-prose *)) { color: #93c5fd; }
</style>


