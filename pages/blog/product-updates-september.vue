<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <article class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Product Updates: September</h1>
      <ul>
        <li>New modern logo and favicon</li>
        <li>English UI copy refinements</li>
        <li>Performance and API error-handling improvements</li>
      </ul>
      <p>Thanks for using movAi! More to come next month.</p>
    </article>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
useHead({ 
  title: 'Product Updates: September',
  meta: [
    { name: 'description', content: 'September release highlights: branding refresh, copy improvements, performance tweaks.' }
  ]
})
</script>

<style scoped>
</style>


