<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <article class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Introducing movAi: Emotion-based Recommendations</h1>
      <p class="lead">How movAi personalizes your experience based on your mood.</p>
      <p>
        movAi brings a fresh approach to movie and TV discovery. Share your mood, and we blend
        emotional cues with your watching habits to surface content you will love.
      </p>
      <h2>Why emotions?</h2>
      <p>
        Emotions guide our choices. By factoring mood into the recommendation pipeline, movAi can
        suggest titles that better match how you feel right now.
      </p>
      <h2>What’s next</h2>
      <p>We will keep iterating with your feedback. Enjoy exploring!</p>
    </article>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
useHead({ 
  title: 'Introducing movAi',
  meta: [
    { name: 'description', content: 'Introducing movAi: a fresh way to discover movies and TV shows by mood.' }
  ]
})
</script>

<style scoped>
.prose :where(a):not(:where(.not-prose *)) { color: #93c5fd; }
</style>


