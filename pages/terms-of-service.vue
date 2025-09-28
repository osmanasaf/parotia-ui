<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <main class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Hizmet Koşulları</h1>
      <p>Son güncelleme: {{ lastUpdated }}</p>

      <h2>Koşulların Kabulü</h2>
      <p>movAi’yi kullanarak bu koşulları kabul etmiş sayılırsınız.</p>

      <h2>Hizmetin Kullanımı</h2>
      <ul>
        <li>Hizmeti kullanmak için en az 13 yaşında olmalısınız.</li>
        <li>Platformu kötüye kullanmayın veya çalışmasını bozmayı denemeyin.</li>
        <li>Fikri mülkiyet haklarına ve diğer kullanıcılara saygı gösterin.</li>
      </ul>

      <h2>Hesaplar</h2>
      <p>Hesabınızı korumaktan sorumlusunuz; herhangi bir ihlal durumunda derhal bizi bilgilendirin.</p>

      <h2>İçerik</h2>
      <p>Üçüncü taraf kaynaklardan bilgiler gösterebiliriz. Doğruluk veya erişilebilirlik garantisi vermeyiz.</p>

      <h2>Sonlandırma</h2>
      <p>Bu koşulları ihlal eden hesaplar askıya alınabilir veya sonlandırılabilir.</p>

      <h2>Değişiklikler</h2>
      <p>Bu koşulları güncelleyebiliriz. Hizmeti kullanmaya devam etmeniz değişiklikleri kabul ettiğiniz anlamına gelir.</p>

      <h2>İletişim</h2>
      <p>Bu koşullarla ilgili sorularınız için yardım bölümünden bize ulaşabilirsiniz.</p>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
const lastUpdated = new Date().toISOString().slice(0, 10)
useHead({ 
  title: 'Hizmet Koşulları',
  meta: [
    { name: 'description', content: 'movAi hizmet koşulları ve kabul edilebilir kullanım politikası.' }
  ]
})
</script>

<style scoped>
.prose :where(a):not(:where(.not-prose *)) { color: #93c5fd; }
</style>


