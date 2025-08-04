# 🎬 Parotia - Duygu Bazlı Film Öneri Sistemi

Ruh halinize göre mükemmel film ve dizi önerilerini keşfedin.

## 📋 Proje Hakkında

Parotia, kullanıcıların duygusal durumlarına göre kişiselleştirilmiş film ve dizi önerileri sunan modern bir web uygulamasıdır. Yapay zeka destekli öneri sistemi ile kullanıcılara en uygun içerikleri bulma deneyimi sağlar.

## ✨ Özellikler

- 🎭 Duygu bazlı akıllı film ve dizi önerileri
- 🎨 Modern ve responsive tasarım
- ⚡ Hızlı ve kullanıcı dostu arayüz
- 📱 Mobil uyumlu tasarım
- 🔍 Detaylı film ve dizi bilgileri
- 🎬 Geniş içerik veritabanı

## 🛠️ Teknolojiler

- **Framework**: [Nuxt 4](https://nuxt.com/) 
- **Frontend**: [Vue 3](https://vuejs.org/) (Composition API)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Dil**: TypeScript
- **Font**: Inter & Space Grotesk

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm, yarn, pnpm veya bun

### Kurulum Adımları

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullanici-adi/parotia-ui.git
cd parotia-ui
```

2. Bağımlılıkları kurun:
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

3. Geliştirme sunucusunu başlatın:
```bash
# npm
npm run dev

# pnpm  
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🏗️ Build ve Deploy

### Production Build

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### Preview

Production build'i yerel olarak önizlemek için:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 📁 Proje Yapısı

```
parotia-ui/
├── assets/
│   └── css/           # Global stiller
├── composables/       # Vue composable'lar
├── pages/
│   ├── movie/         # Film sayfaları
│   └── tv/           # Dizi sayfaları
├── public/           # Statik dosyalar
├── app.vue          # Ana uygulama komponenti
└── nuxt.config.ts   # Nuxt konfigürasyonu
```

## 🔧 Konfigürasyon

Proje, `nuxt.config.ts` dosyasında yapılandırılmıştır. Ana konfigürasyon ayarları:

- **API Base URL**: `http://localhost:8000` (varsayılan)
- **SSR**: Aktif
- **DevTools**: Geliştirme modunda aktif
- **TailwindCSS**: Vite plugin ile entegre

Çevre değişkenleri:
```bash
API_BASE_URL=http://localhost:8000  # Backend API URL'si
```

## 🎯 Kullanım

1. Ana sayfada ruh halinizi seçin
2. Sistem size uygun film/dizi önerilerini gösterecek
3. İlginizi çeken içeriğe tıklayarak detaylarını görün
4. Beğendiğiniz içerikleri favorilerinize ekleyin

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---
