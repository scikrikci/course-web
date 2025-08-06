# 🎓 Eğitim Platformu UI Prototipi - Proje Dokümanı

## 📋 Proje Özeti

**Proje Adı:** EduHub - Eğitim Platformu UI Prototipi  
**Amaç:** Rol bazlı eğitim platformu arayüzlerinin geliştirilmesi ve test edilmesi  
**Durum:** UI Prototipi (Backend entegrasyonu olmayacak)  
**Tahmini Süre:** 2-3 hafta  

## 🎯 Teknik Spesifikasyonlar

### Kullanılacak Teknolojiler
- **Framework:** Next.js 14 (App Router)
- **UI Library:** shadcn/ui + Tailwind CSS
- **State Management:** React Context + useState/useReducer
- **Veri Kaynağı:** Statik JSON dosyaları
- **Icons:** Lucide React
- **Responsive:** Mobile-first approach

### Proje Yapısı
```
course-web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── student/
│   │   ├── teacher/
│   │   ├── admin/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── layout/
│   │   ├── role-specific/
│   │   └── shared/
│   ├── data/
│   │   ├── users.json
│   │   ├── courses.json
│   │   ├── assignments.json
│   │   └── messages.json
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── data-helpers.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useRole.ts
│   └── types/
│       └── index.ts
```

## 👥 Kullanıcı Rolleri ve Özellikleri

### 🎓 Öğrenci (Student)
**Erişim Sayfaları:**
- Dashboard (Genel Bakış)
- Derslerim (My Courses)
- Ödevler (Assignments) 
- Takvim (Calendar)
- Notlarım (My Notes)
- Sınıf Mesajları (Class Chat)
- Kütüphane (Library)
- Kişisel Gelişim (Personal Development)

**Özellikler:**
- Ders takip sistemi
- Ödev teslim arayüzü
- Quiz görüntüleme
- Mesajlaşma (salt okunur)
- Kişisel not alma
- Seviyeye göre içerik filtreleme

### 👩‍🏫 Öğretmen (Teacher)
**Erişim Sayfaları:**
- Dashboard (Sınıf Özeti)
- Derslerim (My Classes)
- Materyal Paylaşımı (Content Management)
- Ödev Değerlendirme (Assignment Review)
- Duyurular (Announcements)
- Quiz Oluşturma (Quiz Creator)
- Öğrenci Notları (Student Records)

**Özellikler:**
- Ders materyali yükleme simülasyonu
- Ödev notlandırma arayüzü
- Duyuru oluşturma
- Quiz ve etkinlik tasarımı
- Öğrenci performans takibi

### 🏢 Yönetici (Admin)
**Erişim Sayfaları:**
- Dashboard (Sistem Özeti)
- Kullanıcı Yönetimi (User Management)
- Sınıf Yönetimi (Class Management)
- Performans Raporları (Reports)
- Sistem Ayarları (Settings)
- Genel Duyurular (Global Announcements)

**Özellikler:**
- Kullanıcı ekleme/düzenleme simülasyonu
- Sınıf oluşturma/yönetimi
- Sistem geneli raporlama
- Platform ayarları

## 🤖 AI Özellikleri (UI Simülasyonu)

### 1. Yazım Asistanı
- Real-time yazım kontrolü simülasyonu
- Önerilerin görsel gösterimi
- Gramer düzeltme arayüzü

### 2. Quiz Üretici
- Form tabanlı quiz oluşturma
- AI destekli soru önerisi simülasyonu
- Sonuç önizleme

### 3. Kişisel Rehber
- Öneri kartları sistemi
- Seviyeye özel öneriler
- İlerleme takip arayüzü

### 4. İçerik Özetleme
- Link analiz simülasyonu
- Not özetleme arayüzü
- Anahtar kelime çıkarma

## 📱 UI/UX Tasarım Prensipleri

### Layout Yapısı
1. **Landing Page:** Modern, minimal, etkili tanıtım
2. **Authentication:** Basit kullanıcı seçimi + rol belirleme
3. **Dashboard Layout:**
   - Sol Sidebar (Discord/Slack tarzı)
   - Üst Navigation Bar
   - Ana İçerik Alanı
   - Sağ Panel (bildirimler, hızlı erişim)

### Responsive Tasarım
- **Desktop:** Full layout (sidebar + main + optional right panel)
- **Tablet:** Collapsible sidebar
- **Mobile:** Bottom navigation + drawer menu

### Tema Sistemi
- Light/Dark mode toggle
- Rol bazlı renk şemaları
- Accessibility compliance

## 📊 Veri Yapısı

### users.json
```json
{
  "users": [
    {
      "id": 1,
      "username": "ahmet_ogrenci",
      "name": "Ahmet Yılmaz",
      "role": "student",
      "level": "B1",
      "classId": 1,
      "avatar": "/avatars/student1.jpg"
    },
    {
      "id": 2,
      "username": "ayse_ogretmen",
      "name": "Ayşe Demir",
      "role": "teacher",
      "classIds": [1, 2, 3],
      "avatar": "/avatars/teacher1.jpg"
    },
    {
      "id": 3,
      "username": "mehmet_admin",
      "name": "Mehmet Kaya",
      "role": "admin",
      "avatar": "/avatars/admin1.jpg"
    }
  ]
}
```

### courses.json
```json
{
  "courses": [
    {
      "id": 1,
      "name": "İngilizce Orta Seviye",
      "level": "B1",
      "teacherId": 2,
      "studentIds": [1],
      "materials": [
        {
          "id": 1,
          "title": "Unit 1: Daily Routines",
          "type": "video",
          "url": "#",
          "uploadDate": "2024-01-15"
        }
      ]
    }
  ]
}
```

### assignments.json
```json
{
  "assignments": [
    {
      "id": 1,
      "title": "Grammar Exercise - Present Tense",
      "courseId": 1,
      "teacherId": 2,
      "dueDate": "2024-02-01",
      "submissions": [
        {
          "studentId": 1,
          "submittedAt": "2024-01-28",
          "grade": null,
          "feedback": null
        }
      ]
    }
  ]
}
```

## 🔄 Uygulama Akışı

### 1. Landing Page Akışı
1. Platform tanıtımı
2. Özellik showcase
3. Rol bazlı demo bölümleri
4. Giriş yap butonu

### 2. Authentication Akışı
1. Kullanıcı listesi gösterimi
2. Rol seçimi
3. Dashboard yönlendirmesi
4. Session management (localStorage)

### 3. Dashboard Akışı
1. Rol bazlı sidebar render
2. İçerik yetkilendirme
3. Dynamic navigation
4. Real-time UI simülasyonu

## 🧪 Test Senaryoları

### Fonksiyonel Testler
- [ ] Rol bazlı erişim kontrolü
- [ ] Sidebar navigation
- [ ] Responsive design
- [ ] Form validasyonları
- [ ] Mock data rendering

### UI/UX Testler
- [ ] Dark/Light theme switching
- [ ] Mobile navigation
- [ ] Loading states
- [ ] Error handling
- [ ] Accessibility features

## 🚀 Geliştirme Aşamaları

### Faz 1: Temel Yapı (3-4 gün)
- [x] Next.js projesi kurulumu
- [ ] shadcn/ui entegrasyonu
- [ ] Temel layout componentleri
- [ ] Authentication sistemi
- [ ] JSON data structure

### Faz 2: Rol Bazlı Arayüzler (5-6 gün)
- [ ] Öğrenci dashboard ve sayfaları
- [ ] Öğretmen dashboard ve sayfaları
- [ ] Admin dashboard ve sayfaları
- [ ] Sidebar navigation sistemi

### Faz 3: Özellik Geliştirme (4-5 gün)
- [ ] AI özellik simülasyonları
- [ ] Mesajlaşma arayüzü
- [ ] Quiz/Assignment arayüzleri
- [ ] Responsive optimizasyonlar

### Faz 4: İyileştirme ve Test (2-3 gün)
- [ ] Performance optimizasyonları
- [ ] Accessibility iyileştirmeleri
- [ ] Cross-browser testleri
- [ ] Final review ve documentation

## 💡 Ek Özellikler (Opsiyonel)

### Gelişmiş UI Özellikleri
- Drag & drop lesson planner
- Interactive calendar
- Real-time notification system (UI only)
- Advanced search with filters
- Zoom/Meet integration buttons
- Gamification elements

### Performans Optimizasyonları
- Image optimization
- Lazy loading
- Code splitting
- Bundle size optimization

## 📋 Teslim Kriterleri

### Zorunlu Gereksinimler
- ✅ Next.js App Router kullanımı
- ✅ shadcn/ui component library
- ✅ Rol bazlı erişim kontrolü
- ✅ Responsive design
- ✅ Statik JSON veri kullanımı
- ✅ Mock AI özellik arayüzleri

### Kalite Standartları
- Clean, maintainable code
- TypeScript kullanımı
- Component reusability
- Consistent design system
- Proper error handling
- Accessibility compliance

## 🔧 Kurulum ve Çalıştırma

```bash
# Proje kurulumu
npx create-next-app@latest course-web --typescript --tailwind --app
cd course-web

# shadcn/ui kurulumu
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card select

# Geliştirme sunucusu
npm run dev
```

## 📞 İletişim ve Destek

**Proje Yöneticisi:** [İsim]  
**Geliştirici:** [İsim]  
**Tasarımcı:** [İsim]  

---

**Son Güncelleme:** Ocak 2024  
**Versiyon:** 1.0  
**Status:** Planlama Aşaması