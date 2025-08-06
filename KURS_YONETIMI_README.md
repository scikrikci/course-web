# 🎓 Kurs Yönetim Sistemi - Özellikler Dokümanı

## 🎯 Yeni Özellikler

Bu güncellemede öğrenciler için aşağıdaki kurs yönetim özellikleri eklendi:

### ✅ Kurs Bilgileri Görüntüleme
- **Başlangıç ve bitiş tarihleri** görüntüleme
- **Kurs açıklaması** ve seviye bilgisi
- **Kurs durumu** (Aktif, Donduruldu, Tamamlandı, Bırakıldı)
- **Dondurma geçmişi** (kaç kez dondurulduğu)

### ❄️ Kurs Dondurma Sistemi
- **Uzaktan kurs dondurma** isteği gönderme
- **Dondurma sebebi** belirtme (isteğe bağlı)
- **Admin onay süreci** (mock implementation)
- **Dondurma geçmişi** takibi

### 💬 Öğretmen İletişimi
- **Öğretmene mesaj gönderme** kurs bazında
- **Konu ve içerik** belirleme
- **Mesaj tipi kategorileri**:
  - 📚 Kurs Duyuruları
  - ❄️ Dondurma İşlemleri  
  - 🔄 Devam Bildirimleri
  - 💌 Kişisel Mesajlar

### 🔄 Kurs Devam Sistemi
- **Kurs tamamlanma bildirimi** (son 2 hafta)
- **Sonraki kura devam tercihi**
- **Mevcut sonraki kursları** görüntüleme
- **Otomatik bildirim sistemi**

## 🏗️ Teknik Implementasyon

### Database Schema
```sql
-- Kurs bilgileri
model Course {
  id          String
  title       String
  level       String
  description String?
  duration    Int      // hafta cinsinden
  startDate   DateTime
  endDate     DateTime
  teacherId   String
  isActive    Boolean
}

-- Öğrenci kayıtları
model Enrollment {
  id          String
  userId      String
  courseId    String
  status      EnrollmentStatus // ACTIVE, FROZEN, COMPLETED, DROPPED
  enrolledAt  DateTime
  completedAt DateTime?
  freezeCount Int
}

-- Kurs dondurma işlemleri
model CourseFreeze {
  id           String
  enrollmentId String
  reason       String?
  frozenAt     DateTime
  unfrozenAt   DateTime?
  isActive     Boolean
}

-- Kurs devam tercihleri
model CourseProgression {
  id           String
  userId       String
  courseId     String
  nextCourseId String?
  willContinue Boolean
  notifiedAt   DateTime?
}

-- Mesajlaşma sistemi
model Message {
  id         String
  senderId   String
  receiverId String?
  courseId   String?
  subject    String
  content    String
  messageType MessageType // PERSONAL, COURSE_ANNOUNCEMENT, FREEZE_REQUEST, CONTINUATION_NOTICE
  isRead     Boolean
  sentAt     DateTime
}
```

### API Endpoints

#### 📚 Kurs Bilgileri
- `GET /api/enrollments?userId={id}` - Öğrencinin kurslarını listele
- `GET /api/courses/continue?userId={id}` - Devam tercihlerini getir

#### ❄️ Kurs Dondurma
- `POST /api/courses/freeze` - Kurs dondurma isteği gönder
- `DELETE /api/courses/freeze?freezeId={id}&userId={id}` - Dondurma işlemini geri al

#### 🔄 Kurs Devam Sistemi
- `POST /api/courses/continue` - Devam tercihi gönder

#### 💬 Mesajlaşma
- `GET /api/messages?userId={id}&type={type}` - Mesajları listele
- `POST /api/messages` - Yeni mesaj gönder
- `PATCH /api/messages` - Mesajı okundu olarak işaretle

## 🎨 UI/UX Özellikleri

### Kurs Kartları
- **Modern card design** with color-coded borders
- **Status badges** for quick identification
- **Action buttons** for each operation
- **Progress tracking** and date information

### Dialog Modalları
- **Kurs dondurma** dialog with reason input
- **Mesaj gönderme** dialog with subject/content
- **Kurs devam** dialog with next course selection
- **Responsive design** for mobile/tablet

### Mesaj Sistemi
- **Kategorize edilmiş mesajlar** with filters
- **Unread indicators** and click-to-read
- **Message type icons** and badges
- **Date/time formatting** in Turkish locale

## 🚀 Kullanım Senaryoları

### Senaryo 1: B1 Öğrencisi Kurs Dondurma
1. Öğrenci "Derslerim" sekmesine gider
2. "İngilizce B1" kartında "Kursu Dondur" butonuna tıklar
3. Dondurma sebebini yazar (isteğe bağlı)
4. İstek admin onayına gönderilir
5. Onay sonrası kurs durumu "Donduruldu" olur

### Senaryo 2: Öğretmenle İletişim
1. Öğrenci kurs kartından "Mesaj Gönder" butonuna tıklar
2. Konu ve mesaj içeriğini yazar
3. Mesaj öğretmene ulaşır
4. Öğretmen cevabı "Mesajlar" sekmesinde görünür

### Senaryo 3: Kurs Tamamlama ve Devam
1. Kurs bitiş tarihine 2 hafta kala "Sonraki Kurs" butonu aktif olur
2. Öğrenci devam etmek istediğini belirtir
3. Mevcut sonraki kurslar listesinden seçim yapar
4. Bildirim sisteme kaydedilir

## 🔧 Mock Data
Sistemde şu anda mock data kullanılıyor:
- 2 örnek kurs (İngilizce B1, Matematik)
- Çeşitli mesaj tipleri
- Sonraki kurs seçenekleri
- Dondurma geçmişi

## 📱 Responsive Design
- **Desktop**: Full layout with cards and dialogs
- **Tablet**: Responsive grid system
- **Mobile**: Touch-friendly buttons and modals

## 🎯 Sonraki Geliştirmeler
- [ ] Gerçek veritabanı entegrasyonu
- [ ] Admin panel ile onay süreçleri
- [ ] Email bildirimleri
- [ ] Kurs takvimi entegrasyonu
- [ ] Ödeme sistemi entegrasyonu
- [ ] Çoklu dil desteği

## 🛠️ Kullanılan Teknolojiler
- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

Bu sistem öğrencilerin kurs yönetim ihtiyaçlarını karşılamak için tasarlanmıştır ve gelecekte gerçek veritabanı entegrasyonu ile production-ready hale getirilebilir.