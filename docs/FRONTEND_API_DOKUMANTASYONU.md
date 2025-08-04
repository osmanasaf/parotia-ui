# Parotia API - Frontend Geliştirme Dokümantasyonu

## İçindekiler
1. [Genel Bilgiler](#genel-bilgiler)
2. [Kimlik Doğrulama](#kimlik-doğrulama)
3. [Film API'leri](#film-apileri)
4. [TV/Dizi API'leri](#tvdizi-apileri)
5. [Öneri Sistemi API'leri](#öneri-sistemi-apileri)
6. [Duygu Analizi API'leri](#duygu-analizi-apileri)
7. [Sistem API'leri](#sistem-apileri)
8. [Hata Yönetimi](#hata-yönetimi)
9. [Frontend Entegrasyon Örnekleri](#frontend-entegrasyon-örnekleri)

---

## Genel Bilgiler

### Base URL
```
http://localhost:8000
```

### API Versiyonu
```
v1.0.0
```

### Content-Type
```
application/json
```

### Kimlik Doğrulama
Çoğu endpoint Bearer token gerektirir:
```
Authorization: Bearer {access_token}
```

---

## Kimlik Doğrulama

### 1. Kullanıcı Kaydı
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "kullaniciadi",
  "password": "güçlü_şifre"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "kullaniciadi",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T10:00:00"
}
```

**Kullanım:** Yeni kullanıcı kaydı. Kayıt sonrası email doğrulaması gerekli.

---

### 2. Email Doğrulama Kodu Gönder
**Endpoint:** `POST /auth/send-verification?email=user@example.com`

**Response (200):**
```json
{
  "message": "Verification email sent successfully",
  "verification_code": "123456"
}
```

**Kullanım:** Kullanıcıya email doğrulama kodu gönderir.

---

### 3. Email Doğrulama
**Endpoint:** `POST /auth/verify-email?email=user@example.com&code=123456`

**Response (200):**
```json
{
  "message": "Email verified successfully!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "kullaniciadi",
    "is_verified": true
  }
}
```

**Kullanım:** Email doğrulama kodunu kontrol eder ve hesabı aktive eder.

---

### 4. Giriş Yapma
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "güçlü_şifre"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Kullanım:** Kullanıcı girişi yapar ve JWT token alır.

---

### 5. Kullanıcı Bilgileri
**Endpoint:** `GET /auth/me`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "kullaniciadi",
  "is_active": true,
  "is_verified": true,
  "created_at": "2024-01-01T10:00:00"
}
```

**Kullanım:** Giriş yapmış kullanıcının bilgilerini getirir.

---

## Film API'leri

### 1. Popüler Filmler
**Endpoint:** `GET /movies/popular?page=1`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "total_pages": 500,
    "total_results": 10000,
    "results": [
      {
        "id": 123,
        "title": "Film Adı",
        "overview": "Film açıklaması...",
        "poster_path": "/poster.jpg",
        "backdrop_path": "/backdrop.jpg",
        "release_date": "2024-01-01",
        "vote_average": 7.5,
        "vote_count": 1000,
        "genre_ids": [28, 12, 16]
      }
    ]
  }
}
```

**Kullanım:** Ana sayfada popüler filmleri listelemek için.

---

### 2. Film Detayları
**Endpoint:** `GET /movies/{tmdb_id}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "Film Adı",
    "overview": "Detaylı film açıklaması...",
    "poster_path": "/poster.jpg",
    "backdrop_path": "/backdrop.jpg",
    "release_date": "2024-01-01",
    "runtime": 120,
    "vote_average": 7.5,
    "vote_count": 1000,
    "genres": [
      {"id": 28, "name": "Action"},
      {"id": 12, "name": "Adventure"}
    ],
    "production_companies": [],
    "cast": [],
    "crew": []
  }
}
```

**Kullanım:** Film detay sayfasında tam bilgileri göstermek için.

---

### 3. Film Arama
**Endpoint:** `GET /movies/search?query=film_adı&page=1`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "total_pages": 10,
    "total_results": 200,
    "results": [
      {
        "id": 123,
        "title": "Aranan Film",
        "overview": "Film açıklaması...",
        "poster_path": "/poster.jpg",
        "release_date": "2024-01-01",
        "vote_average": 7.5
      }
    ]
  }
}
```

**Kullanım:** Arama özelliği için.

---

### 4. İzleme Sağlayıcıları
**Endpoint:** `GET /movies/{tmdb_id}/watch-providers`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": {
      "TR": {
        "flatrate": [
          {
            "provider_id": 8,
            "provider_name": "Netflix",
            "logo_path": "/netflix.jpg"
          }
        ],
        "rent": [],
        "buy": []
      }
    }
  }
}
```

**Kullanım:** Kullanıcıya filmi nerede izleyebileceğini göstermek için.

---

### 5. Film Puanlama
**Endpoint:** `POST /movies/rate`
**Auth:** Bearer token gerekli

**Request Body:**
```json
{
  "tmdb_id": 123,
  "content_type": "movie",
  "rating": 8,
  "comment": "Harika bir filmdi!"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "tmdb_id": 123,
  "content_type": "movie",
  "rating": 8,
  "comment": "Harika bir filmdi!",
  "created_at": "2024-01-01T10:00:00",
  "updated_at": null
}
```

**Kullanım:** Kullanıcının film puanlaması için. Aynı zamanda duygu profili güncellenir.

---

### 6. Kullanıcının Film Puanları
**Endpoint:** `GET /movies/my/ratings`
**Auth:** Bearer token gerekli

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "tmdb_id": 123,
    "content_type": "movie",
    "rating": 8,
    "comment": "Harika bir filmdi!",
    "created_at": "2024-01-01T10:00:00",
    "updated_at": null
  }
]
```

**Kullanım:** Kullanıcının puanladığı filmleri listelemek için.

---

### 7. İzleme Listesine Ekleme
**Endpoint:** `POST /movies/watchlist`
**Auth:** Bearer token gerekli

**Request Body:**
```json
{
  "tmdb_id": 123,
  "content_type": "movie",
  "status": "to_watch"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "tmdb_id": 123,
  "content_type": "movie",
  "status": "to_watch",
  "added_at": "2024-01-01T10:00:00",
  "updated_at": null
}
```

**Status Değerleri:**
- `to_watch`: İzlenecek
- `watching`: İzleniyor
- `completed`: İzlendi

**Kullanım:** Film kartlarında "Listeye Ekle" butonu için.

---

### 8. İzleme Listesi
**Endpoint:** `GET /movies/my/watchlist?status=to_watch`
**Auth:** Bearer token gerekli

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "tmdb_id": 123,
    "content_type": "movie",
    "status": "to_watch",
    "added_at": "2024-01-01T10:00:00",
    "updated_at": null
  }
]
```

**Kullanım:** Kullanıcının izleme listesini göstermek için.

---

### 9. İzleme Listesi Durumu Güncelleme
**Endpoint:** `PUT /movies/watchlist/{tmdb_id}?status=completed`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "tmdb_id": 123,
  "content_type": "movie",
  "status": "completed",
  "added_at": "2024-01-01T10:00:00",
  "updated_at": "2024-01-02T10:00:00"
}
```

**Kullanım:** Film izlendiğinde durumu güncellemek için.

---

## TV/Dizi API'leri

### 1. Popüler Diziler
**Endpoint:** `GET /tv/popular?page=1`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "total_pages": 500,
    "total_results": 10000,
    "results": [
      {
        "id": 456,
        "name": "Dizi Adı",
        "overview": "Dizi açıklaması...",
        "poster_path": "/poster.jpg",
        "backdrop_path": "/backdrop.jpg",
        "first_air_date": "2024-01-01",
        "vote_average": 8.2,
        "vote_count": 500,
        "genre_ids": [18, 80]
      }
    ]
  }
}
```

**Kullanım:** Ana sayfada popüler dizileri listelemek için.

---

### 2. Dizi Detayları
**Endpoint:** `GET /tv/{tmdb_id}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "name": "Dizi Adı",
    "overview": "Detaylı dizi açıklaması...",
    "poster_path": "/poster.jpg",
    "backdrop_path": "/backdrop.jpg",
    "first_air_date": "2024-01-01",
    "last_air_date": "2024-12-01",
    "number_of_seasons": 3,
    "number_of_episodes": 30,
    "vote_average": 8.2,
    "genres": [
      {"id": 18, "name": "Drama"},
      {"id": 80, "name": "Crime"}
    ],
    "seasons": [],
    "cast": [],
    "crew": []
  }
}
```

**Kullanım:** Dizi detay sayfasında tam bilgileri göstermek için.

---

### 3. Dizi Arama
**Endpoint:** `GET /tv/search?query=dizi_adı&page=1`

**Response:** Film arama ile aynı format, sadece `name` alanı `title` yerine kullanılır.

---

### 4. Dizi Puanlama
**Endpoint:** `POST /tv/rate`
**Auth:** Bearer token gerekli

**Request/Response:** Film puanlama ile aynı format, `content_type: "tv"` kullanılır.

---

### 5. Kullanıcının Dizi Puanları
**Endpoint:** `GET /tv/my/ratings`
**Auth:** Bearer token gerekli

**Response:** Film puanları ile aynı format.

---

### 6. Dizi İzleme Listesi İşlemleri
**Endpoints:**
- `POST /tv/watchlist` - Listeye ekleme
- `GET /tv/my/watchlist?status=watching` - Liste görüntüleme
- `PUT /tv/watchlist/{tmdb_id}?status=completed` - Durum güncelleme

**Request/Response:** Film watchlist ile aynı format, `content_type: "tv"` kullanılır.

---

## Öneri Sistemi API'leri

### 1. Geçmiş Tabanlı Öneriler
**Endpoint:** `POST /recommendations/history`
**Auth:** Bearer token gerekli

**Request Body:**
```json
{
  "content_type": "movie",
  "page": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "tmdb_id": 123,
        "content_type": "movie",
        "recommendation_type": "history_based",
        "score": 0.85,
        "emotion_state": null,
        "tmdb_data": {
          "id": 123,
          "title": "Önerilen Film",
          "overview": "...",
          "poster_path": "/poster.jpg",
          "vote_average": 7.5
        }
      }
    ],
    "total": 20,
    "page": 1
  }
}
```

**Kullanım:** "Beğendiklerinize Benzer" bölümü için.

---

### 2. Anlık Duygu Tabanlı Öneriler
**Endpoint:** `POST /recommendations/current-emotion?emotion_text=mutluyum&content_type=movie`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "tmdb_id": 123,
        "content_type": "movie",
        "recommendation_type": "emotion_based",
        "score": 0.92,
        "emotion_state": "joy",
        "tmdb_data": {
          "id": 123,
          "title": "Mutluluk Filmi",
          "overview": "...",
          "poster_path": "/poster.jpg",
          "vote_average": 8.0
        }
      }
    ],
    "emotion_analysis": {
      "primary_emotion": "joy",
      "emotion_scores": {
        "joy": 0.8,
        "excitement": 0.6,
        "calm": 0.3
      },
      "emotional_intensity": 0.7
    }
  }
}
```

**Kullanım:** "Bugün Nasıl Hissediyorsunuz?" özelliği için.

---

### 3. Hibrit Öneriler (En Önemli)
**Endpoint:** `POST /recommendations/hybrid`
**Auth:** Bearer token gerekli

**Request Body:**
```json
{
  "emotion_text": "Bugün biraz melankolik hissediyorum, düşündürücü bir şey izlemek istiyorum",
  "content_type": "movie"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "tmdb_id": 123,
        "content_type": "movie",
        "recommendation_type": "hybrid",
        "score": 0.89,
        "emotion_state": "melancholy",
        "tmdb_data": {
          "id": 123,
          "title": "Düşündürücü Film",
          "overview": "...",
          "poster_path": "/poster.jpg",
          "vote_average": 8.5
        }
      }
    ],
    "emotion_analysis": {
      "primary_emotion": "melancholy",
      "emotion_scores": {
        "melancholy": 0.7,
        "contemplation": 0.6,
        "sadness": 0.4
      }
    },
    "recommendation_strategy": "70% emotion + 30% history"
  }
}
```

**Kullanım:** Ana öneri sistemi için. En dengeli sonuçları verir.

---

### 4. Profil Tabanlı Öneriler
**Endpoint:** `POST /recommendations/profile-based?content_type=movie`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "tmdb_id": 123,
        "content_type": "movie",
        "recommendation_type": "profile_based",
        "score": 0.82,
        "emotion_state": "user_preference",
        "tmdb_data": {...}
      }
    ],
    "user_profile_summary": {
      "dominant_emotions": ["joy", "excitement"],
      "preferred_genres": ["Action", "Comedy"],
      "emotional_intensity_preference": 0.6
    }
  }
}
```

**Kullanım:** "Size Özel" bölümü için.

---

### 5. Öneri Seçimi Kaydetme
**Endpoint:** `POST /recommendations/select`
**Auth:** Bearer token gerekli

**Request Body:**
```json
{
  "tmdb_id": 123,
  "content_type": "movie",
  "recommendation_type": "hybrid",
  "source": "homepage",
  "recommendation_score": 0.89,
  "selected_rank": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Seçim kaydedildi",
  "selection_id": 15
}
```

**Kullanım:** Kullanıcı bir öneriyi seçtiğinde izleme için.

---

### 6. Watchlist'e Ekleme (Öneriden)
**Endpoint:** `POST /recommendations/{tmdb_id}/add-to-watchlist?content_type=movie&recommendation_type=hybrid&recommendation_score=0.89`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "message": "Film watchlist'e eklendi ve recommendation tracking aktif",
  "data": {
    "tmdb_id": 123,
    "content_type": "movie",
    "recommendation_type": "hybrid",
    "recommendation_score": 0.89
  }
}
```

**Kullanım:** Öneri kartlarında "Listeye Ekle" butonu için.

---

### 7. Öneri Geçmişi
**Endpoint:** `GET /recommendations/my/history?recommendation_type=hybrid`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tmdb_id": 123,
      "content_type": "movie",
      "recommendation_type": "hybrid",
      "emotion_state": "melancholy",
      "score": 0.89,
      "created_at": "2024-01-01T10:00:00",
      "selected": true,
      "watched": false
    }
  ]
}
```

**Kullanım:** "Geçmiş Öneriler" sayfası için.

---

### 8. Öneri İstatistikleri
**Endpoint:** `GET /recommendations/tracking/stats`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_recommendations_received": 50,
    "total_selections": 15,
    "selection_rate": 0.3,
    "watched_count": 8,
    "watch_rate": 0.53,
    "feedback_provided": 5,
    "feedback_rate": 0.625,
    "average_satisfaction": 4.2
  }
}
```

**Kullanım:** Kullanıcı dashboard'u için.

---

## Duygu Analizi API'leri

### 1. Duygu Analizi
**Endpoint:** `POST /emotion/analyze?emotion_text=Bugün çok mutluyum`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "emotion_text": "Bugün çok mutluyum",
    "analysis": {
      "primary_emotion": "joy",
      "emotion_scores": {
        "joy": 0.85,
        "excitement": 0.6,
        "happiness": 0.7,
        "calm": 0.3
      },
      "emotional_intensity": 0.75,
      "emotional_tone": "positive",
      "confidence": 0.9
    }
  }
}
```

**Kullanım:** Duygu girişi formlarında anlık analiz için.

---

### 2. İçerik Duygu Tonu Analizi
**Endpoint:** `POST /emotion/content-tone/{tmdb_id}?content_type=movie`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tmdb_id": 123,
    "content_type": "movie",
    "emotional_analysis": {
      "primary_emotion": "melancholy",
      "secondary_emotions": ["contemplation", "sadness"],
      "emotional_intensity": 0.7,
      "mood_improving": false,
      "emotionally_cathartic": true,
      "thought_provoking": true,
      "confidence_score": 0.85
    }
  }
}
```

**Kullanım:** Film/dizi detay sayfalarında duygu etiketi göstermek için.

---

### 3. İzlenen İçerikten Duygu Profili
**Endpoint:** `POST /emotion/user-watched-content?content_type=movie`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "current_emotional_state": {
      "dominant_emotion": "joy",
      "emotional_intensity": 0.6,
      "emotional_balance": "positive"
    },
    "recent_watching_patterns": {
      "preferred_emotions": ["joy", "excitement"],
      "emotional_diversity": 0.7,
      "last_7_days_trend": "increasingly_positive"
    },
    "recommendations": {
      "mood_improvement_potential": 0.8,
      "suggested_emotional_direction": "maintain_positivity"
    }
  }
}
```

**Kullanım:** Kullanıcı profil sayfasında duygu durumu özetini göstermek için.

---

### 4. Duygu Profili (Önbellek)
**Endpoint:** `GET /emotion/profile/cached?content_type=movie`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user_emotion_preferences": {
      "joy": 0.3,
      "excitement": 0.25,
      "melancholy": 0.2,
      "calm": 0.15,
      "mystery": 0.1
    },
    "emotional_intensity_preference": 0.6,
    "genre_emotion_mapping": {
      "Action": ["excitement", "adrenaline"],
      "Drama": ["melancholy", "contemplation"],
      "Comedy": ["joy", "lighthearted"]
    },
    "last_updated": "2024-01-01T10:00:00"
  }
}
```

**Kullanım:** Kullanıcı tercihlerini anlamak ve hızlı öneriler için.

---

### 5. Geri Bildirim Gönderme
**Endpoint:** `POST /emotion/feedback`
**Auth:** Bearer token gerekli

**Request Body:**
```json
{
  "tmdb_id": 123,
  "content_type": "movie",
  "pre_viewing_emotion": "sad",
  "post_viewing_emotion": "hopeful",
  "emotional_impact_score": 8,
  "recommendation_accuracy": 9,
  "mood_improvement": true,
  "additional_comments": "Film gerçekten ruh halimi düzeltti"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

**Kullanım:** İzleme sonrası geri bildirim formu için.

---

### 6. Duygu İçgörüleri
**Endpoint:** `GET /emotion/insights`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "success_rate": 0.82,
    "total_recommendations": 50,
    "successful_recommendations": 41,
    "top_emotions": [
      ["joy", 15],
      ["excitement", 12],
      ["melancholy", 8]
    ],
    "top_emotional_tones": [
      ["positive", 25],
      ["contemplative", 15],
      ["energetic", 10]
    ],
    "recent_feedback_count": 5,
    "learning_rate": 0.15
  }
}
```

**Kullanım:** Kullanıcı için kişisel istatistik sayfası.

---

### 7. Duygu İstatistikleri
**Endpoint:** `GET /emotion/statistics`
**Auth:** Bearer token gerekli

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_notifications_sent": 100,
    "total_feedback_received": 45,
    "feedback_rate_percentage": 45.0,
    "average_emotional_impact": 7.2,
    "average_recommendation_accuracy": 8.1,
    "mood_improvement_rate_percentage": 78.0
  }
}
```

**Kullanım:** Sistem performansını göstermek için.

---

## Sistem API'leri

### 1. Sistem Durumu
**Endpoint:** `GET /health`

**Response (200):**
```json
{
  "status": "ok"
}
```

**Kullanım:** Sistem sağlık kontrolü için.

---

## Hata Yönetimi

### HTTP Status Kodları

**200 OK:** Başarılı işlem
**201 Created:** Kaynak oluşturuldu
**400 Bad Request:** Geçersiz istek
**401 Unauthorized:** Kimlik doğrulama gerekli
**403 Forbidden:** Yetki yok
**404 Not Found:** Kaynak bulunamadı
**500 Internal Server Error:** Sunucu hatası

### Hata Response Formatı
```json
{
  "detail": "Hata mesajı açıklaması"
}
```

### Özel Hatalar

**Email doğrulanmamış:**
```json
{
  "detail": "Please verify your email before logging in"
}
```

**Kullanıcı aktif değil:**
```json
{
  "detail": "Inactive user"
}
```

**Geçersiz kimlik bilgileri:**
```json
{
  "detail": "Incorrect email or password"
}
```

---

## Frontend Entegrasyon Örnekleri

### 1. React/Next.js Authentication Hook

```javascript
// hooks/useAuth.js
import { useState, useContext, createContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('parotia_token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserInfo(savedToken);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('parotia_token', data.access_token);
        setToken(data.access_token);
        await fetchUserInfo(data.access_token);
        return { success: true };
      } else {
        return { success: false, error: data.detail };
      }
    } catch (error) {
      return { success: false, error: 'Bağlantı hatası' };
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('parotia_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 2. API Client Service

```javascript
// services/apiClient.js
class ApiClient {
  constructor(baseURL = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('parotia_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API Hatası');
    }

    return response.json();
  }

  // Film işlemleri
  async getPopularMovies(page = 1) {
    return this.request(`/movies/popular?page=${page}`);
  }

  async getMovieDetails(tmdbId) {
    return this.request(`/movies/${tmdbId}`);
  }

  async searchMovies(query, page = 1) {
    return this.request(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async rateMovie(tmdbId, rating, comment = null) {
    return this.request('/movies/rate', {
      method: 'POST',
      body: JSON.stringify({
        tmdb_id: tmdbId,
        content_type: 'movie',
        rating,
        comment
      })
    });
  }

  async addToWatchlist(tmdbId, contentType = 'movie', status = 'to_watch') {
    return this.request('/movies/watchlist', {
      method: 'POST',
      body: JSON.stringify({
        tmdb_id: tmdbId,
        content_type: contentType,
        status
      })
    });
  }

  // Öneri sistemi
  async getHybridRecommendations(emotionText, contentType = 'movie') {
    return this.request('/recommendations/hybrid', {
      method: 'POST',
      body: JSON.stringify({
        emotion_text: emotionText,
        content_type: contentType
      })
    });
  }

  async selectRecommendation(tmdbId, contentType, recommendationType, source, score, rank) {
    return this.request('/recommendations/select', {
      method: 'POST',
      body: JSON.stringify({
        tmdb_id: tmdbId,
        content_type: contentType,
        recommendation_type: recommendationType,
        source,
        recommendation_score: score,
        selected_rank: rank
      })
    });
  }

  // Duygu analizi
  async analyzeEmotion(emotionText) {
    return this.request(`/emotion/analyze?emotion_text=${encodeURIComponent(emotionText)}`, {
      method: 'POST'
    });
  }

  async submitFeedback(feedbackData) {
    return this.request('/emotion/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  }
}

export default new ApiClient();
```

### 3. Öneri Bileşeni Örneği

```jsx
// components/RecommendationEngine.jsx
import { useState } from 'react';
import apiClient from '../services/apiClient';

export default function RecommendationEngine() {
  const [emotionText, setEmotionText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!emotionText.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiClient.getHybridRecommendations(emotionText);
      
      if (response.success) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error('Öneri alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRecommendation = async (rec, index) => {
    try {
      await apiClient.selectRecommendation(
        rec.tmdb_id,
        rec.content_type,
        rec.recommendation_type,
        'recommendation_page',
        rec.score,
        index + 1
      );
      
      // Film detay sayfasına yönlendir
      window.location.href = `/movie/${rec.tmdb_id}`;
    } catch (error) {
      console.error('Seçim kaydedilirken hata:', error);
    }
  };

  return (
    <div className="recommendation-engine">
      <h2>Bugün Nasıl Hissediyorsunuz?</h2>
      
      <div className="emotion-input">
        <textarea
          value={emotionText}
          onChange={(e) => setEmotionText(e.target.value)}
          placeholder="Ruh halinizi ve ne tür bir şey izlemek istediğinizi yazın..."
          rows={3}
        />
        <button onClick={getRecommendations} disabled={loading}>
          {loading ? 'Öneriler Getiriliyor...' : 'Öneri Al'}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Size Özel Öneriler</h3>
          <div className="movie-grid">
            {recommendations.map((rec, index) => (
              <div key={rec.tmdb_id} className="movie-card">
                <img 
                  src={`https://image.tmdb.org/t/p/w300${rec.tmdb_data.poster_path}`}
                  alt={rec.tmdb_data.title || rec.tmdb_data.name}
                />
                <h4>{rec.tmdb_data.title || rec.tmdb_data.name}</h4>
                <p>Eşleşme: {Math.round(rec.score * 100)}%</p>
                <p>Duygu: {rec.emotion_state}</p>
                <button onClick={() => selectRecommendation(rec, index)}>
                  Detayları Gör
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. Watchlist Bileşeni

```jsx
// components/Watchlist.jsx
import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadWatchlist();
  }, [filter]);

  const loadWatchlist = async () => {
    try {
      const response = await apiClient.request(
        `/movies/my/watchlist${filter !== 'all' ? `?status=${filter}` : ''}`
      );
      setWatchlist(response);
    } catch (error) {
      console.error('Watchlist yüklenirken hata:', error);
    }
  };

  const updateStatus = async (tmdbId, newStatus) => {
    try {
      await apiClient.request(`/movies/watchlist/${tmdbId}?status=${newStatus}`, {
        method: 'PUT'
      });
      loadWatchlist(); // Listeyi yenile
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
    }
  };

  return (
    <div className="watchlist">
      <h2>İzleme Listem</h2>
      
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Tümü
        </button>
        <button 
          className={filter === 'to_watch' ? 'active' : ''}
          onClick={() => setFilter('to_watch')}
        >
          İzlenecek
        </button>
        <button 
          className={filter === 'watching' ? 'active' : ''}
          onClick={() => setFilter('watching')}
        >
          İzleniyor
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          İzlendi
        </button>
      </div>

      <div className="watchlist-items">
        {watchlist.map(item => (
          <div key={item.id} className="watchlist-item">
            <h4>TMDB ID: {item.tmdb_id}</h4>
            <p>Durum: {item.status}</p>
            <p>Eklenme: {new Date(item.added_at).toLocaleDateString('tr-TR')}</p>
            
            <div className="status-controls">
              <select 
                value={item.status} 
                onChange={(e) => updateStatus(item.tmdb_id, e.target.value)}
              >
                <option value="to_watch">İzlenecek</option>
                <option value="watching">İzleniyor</option>
                <option value="completed">İzlendi</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Önemli Notlar

### 1. Authentication
- Tüm kullanıcı özgü endpoint'ler Bearer token gerektirir
- Token localStorage'da saklanmalı
- Token süresi dolduğunda yeniden giriş gerekli

### 2. Rate Limiting
- API rate limiting uygulayabilir
- Başarısız isteklerde retry logic kullanın

### 3. TMDB Entegrasyonu
- Poster/backdrop path'leri: `https://image.tmdb.org/t/p/w500{path}`
- Tam boyut görseller için w500 yerine original kullanabilirsiniz

### 4. Gerçek Zamanlı Güncellemeler
- Film puanlama ve watchlist güncellemeleri duygu profilini otomatik günceller
- Öneri seçimleri takip edilir ve geri bildirim sistemi çalışır

### 5. Hata Yönetimi
- Tüm API çağrılarında try-catch kullanın
- Kullanıcı dostu hata mesajları gösterin
- Network hatalarını ele alın

Bu dokümantasyon tüm mevcut endpoint'leri ve kullanım örneklerini içermektedir. Frontend geliştirme sürecinizde referans olarak kullanabilirsiniz.