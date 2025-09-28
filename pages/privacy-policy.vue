<template>
  <div class="min-h-screen gradient-dark">
    <AppHeader />
    <main class="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
      <h1>Gizlilik Politikası</h1>
      <p>Son güncelleme: {{ lastUpdated }}</p>

      <p>
        Gizliliğinize önem veriyoruz. Bu politika hangi verileri topladığımızı, nasıl kullandığımızı
        ve verilerinizle ilgili haklarınızı açıklar.
      </p>

      <h2>Topladığımız Bilgiler</h2>
      <ul>
        <li>Hesap verileri: e‑posta, kullanıcı adı, temel profil bilgileri</li>
        <li>Kullanım verileri: ziyaret edilen sayfalar, önerilerle etkileşimler</li>
        <li>Teknik veriler: cihaz, tarayıcı ve yaklaşık konum</li>
      </ul>

      <h2>Bilgilerinizi Nasıl Kullanıyoruz</h2>
      <ul>
        <li>Kişiselleştirilmiş film/dizi önerileri sunmak</li>
        <li>Hizmetlerimizi ve kullanıcı deneyimini geliştirmek</li>
        <li>Güvenliği sağlamak ve kötüye kullanımı önlemek</li>
      </ul>

      <h2>Veri Saklama</h2>
      <p>Verileri yalnızca yukarıdaki amaçlar için gerekli olduğu veya kanunen gerektiği sürece saklarız.</p>

      <h2>Haklarınız</h2>
      <ul>
        <li>Verilerinize erişme, güncelleme veya silme</li>
        <li>Verilerinizi dışa aktarma</li>
        <li>Uygulanabildiğinde onayı geri çekme</li>
      </ul>

      <h2>İletişim</h2>
      <p>Bu politika ile ilgili sorularınız için yardım bölümünden bize ulaşabilirsiniz.</p>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
const lastUpdated = new Date().toISOString().slice(0, 10)
useHead({ 
  title: 'Gizlilik Politikası',
  meta: [
    { name: 'description', content: 'movAi gizlilik politikası: topladığımız veriler, kullanım amaçlarımız ve haklarınız.' }
  ]
})
</script>

<style scoped>
.prose :where(a):not(:where(.not-prose *)) { color: #93c5fd; }
</style>


