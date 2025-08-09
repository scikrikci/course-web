Next.js Büyük Ölçekli Web Uygulama Geliştirme PRD (Product Requirements Document)
-------------------------------------------------------------------------------

📌 Belge Amacı:
Bu belge, büyük ölçekli ve profesyonel bir Next.js tabanlı web uygulamasının geliştirme sürecinde izlenecek aşamaları tanımlar. Amaç, sürdürülebilir, ölçeklenebilir ve modüler bir yapı inşa etmektir.

===============================================================================
1. PLANLAMA VE ANALİZ
-------------------------------------------------------------------------------
- Hedef kullanıcı kitlesi analizi
- Kullanıcı akışları (user flow), persona çalışmaları
- Domain belirleme (örnek: auth, user, dashboard, payment)
- Rekabet analizi, MVP tanımı
- UI/UX gereksinimleri (Wireframe & Mockup)

===============================================================================
2. PROJE KURULUMU
-------------------------------------------------------------------------------
- Next.js + TypeScript kurulumu
- Tailwind / Shadcn UI setup
- ESLint, Prettier, Husky, lint-staged
- Absolute import ayarları (tsconfig.json)
- Git yapılandırması ve branch stratejisi

===============================================================================
3. DESIGN SYSTEM & UI COMPONENTS
-------------------------------------------------------------------------------
- Atomic design yaklaşımı
- components/ui: Button, Input, Modal, vs.
- components/layout: Header, Sidebar, vs.
- Temalar, dark mode desteği
- Shadcn veya Radix UI entegrasyonu

===============================================================================
4. ROUTING & NAVIGATION
-------------------------------------------------------------------------------
- App Router (Next 13+)
- Public, protected route yapısı
- Nested layout yapısı
- Dynamic route’lar (e.g. /user/[id])

===============================================================================
5. AUTHENTICATION & AUTHORIZATION
-------------------------------------------------------------------------------
- NextAuth.js / Clerk / Auth0 / custom JWT auth
- Session yönetimi (cookies, headers)
- Role-based Access Control (RBAC)
- middleware.ts ile route guard

===============================================================================
6. STATE MANAGEMENT & DATA FETCHING
-------------------------------------------------------------------------------
- Zustand / Jotai / Recoil (client-side state)
- TanStack Query (server state)
- Optimistic UI / Infinite scroll
- Suspense + Streaming ile progressive render

===============================================================================
7. BACKEND / API KATMANI
-------------------------------------------------------------------------------
- REST / GraphQL / TRPC seçimi
- API routes: app/api/ veya pages/api/
- API client setup (Axios, React Query, GraphQL Client)
- Schema validation (Zod / Yup)

===============================================================================
8. VERİTABANI VE ORM
-------------------------------------------------------------------------------
- PostgreSQL / MySQL / MongoDB
- Prisma ORM kullanımı
- db/schema.ts, db/queries.ts yapısı
- Migration, seed scriptleri

===============================================================================
9. MODÜLER DOMAIN YAPISI
-------------------------------------------------------------------------------
- modules/
  └── auth/
      └── routes/, services/, components/, types.ts
  └── user/
  └── course/
  └── payment/
- Modular monolith yaklaşımı

===============================================================================
10. PERFORMANS & SEO
-------------------------------------------------------------------------------
- next/image optimizasyonu
- Lazy loading bileşenler
- Metadata API ile SEO & OpenGraph
- Lighthouse denetimleri

===============================================================================
11. TEST SİSTEMİ
-------------------------------------------------------------------------------
- Unit test: Vitest / Jest
- E2E: Cypress / Playwright
- Mock: MSW
- Coverage raporları

===============================================================================
12. DEPLOYMENT & CI/CD
-------------------------------------------------------------------------------
- Vercel / Docker + VPS
- CI: GitHub Actions
- Environment yönetimi (dev/stage/prod)
- Secret management

===============================================================================
13. MONITORING & ANALYTICS
-------------------------------------------------------------------------------
- Sentry / LogRocket entegrasyonu
- Analytics: Posthog / Plausible
- Performans takibi

===============================================================================
14. SÜRÜMLEME & FEATURE FLAGS
-------------------------------------------------------------------------------
- Git Flow veya trunk-based development
- Feature flag sistemi: LaunchDarkly / Unleash
- A/B test yapıları

===============================================================================
NOT:
Her aşama bağımlı olmak zorunda değildir. Geliştirme sprint'leri paralel ilerletilebilir. Domain odaklı ve modülerlik prensipleri ön planda tutulmalıdır.