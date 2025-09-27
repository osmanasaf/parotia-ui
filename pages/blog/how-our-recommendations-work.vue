<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <article class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>How Our Recommendations Work</h1>
      <p>We combine two key signals to recommend content:</p>
      <ol>
        <li><strong>Emotion-based input</strong>: your current mood and intent</li>
        <li><strong>History-based patterns</strong>: your preferences and similar users</li>
      </ol>
      <p>
        This hybrid approach gives balanced, relevant suggestions. We continue improving the
        ranking model as we gather feedback.
      </p>
    </article>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
useHead({ 
  title: 'How Our Recommendations Work',
  meta: [
    { name: 'description', content: 'A quick overview of movAi’s hybrid ranking approach.' }
  ]
})
</script>

<style scoped>
</style>


