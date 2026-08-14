# 🕌 Al-Qalam Academy: Final Implementation Walkthrough

Welcome to the **Al-Qalam Academy** technical documentation. This walkthrough covers the end-to-end architecture, features, and deployment readiness of your elite virtual Quran school.

## 🏗️ 1. Project Architecture
The platform is built on a high-performance, modern stack designed for scale and security.
- **Frontend**: Next.js 15 (App Router) with TypeScript.
- **Styling**: Industrial-grade custom CSS with Emerald/Gold color tokens, glassmorphism, and **Amiri** Arabic typography.
- **Database**: PostgreSQL with **Prisma ORM** for type-safe data handling.
- **Authentication**: **Auth.js v5 (NextAuth)** with role-based access control (RBAC).
- **Communication**: WebRTC via **Daily.co** & Real-time sync via **Socket.io**.
- **Payments**: **Stripe** with secure Checkout sessions and Webhook fulfillment.

---

## 🧭 2. Ecosystem Walkthrough

### 🏠 A. Public Experience (`/`)
- **Landing Page**: A high-fidelity, high-conversion portal featuring specialized Riwayah tracks (Hafs, Warsh, Qalun).
- **Student Enrollment (`/apply`)**: A multi-step recruitment journey including personal data, learning goals, and placement test simulated submission.
- **Global Pricing (`/pricing`)**: 3-tier subscription model ranging from Foundation to Hifz Intensive.

### 🎓 B. Student Ecosystem (`/dashboard`)
- **Main Dashboard**: Real-time stats (Minutes learned, Knowledge points), active learning plan, and academic calendar.
- **Milestone Engine**: Visual progress tracking (e.g., "65% of Surah Al-Kahf complete").
- **Payment Hub (`/checkout`)**: Shariah-compliant payment portal with support for Cards and Islamic Bank Settlement.

### 📜 C. Teacher Hub (`/teacher`)
- **Faculty Portal**: Recruitment flow for verified scholars (Ijazah upload, recitation samples).
- **Live Studio Management**: Real-time student roster, teaching performance analytics (1% tiering), and internal scholar notes.

### 🕋 D. The Virtual Classroom (`/classroom`)
- **QuranSync Core**: A "Master-Mirror" synchronized Quran reader. Teachers control navigation, highlighting, and Tajweed toggles which sync instantly to students.
- **Daily.co Video**: High-performance video grid with active speaker detection and studio-grade controls.
- **Classroom Chat**: Role-specific messaging system for instruction and questions.

### 🛡️ E. Admin Command Center (`/admin`)
- **Executive Console**: Global KPIs (Total Students, Monthly Revenue, System Health).
- **Quality Control (`/admin/applications`)**: Forensic review queue for teacher and student applications.
- **Financial Ledger (`/admin/finances`)**: Transparent oversight of revenue logs and scholar disbursements.

---

## 🔧 3. Technical Integration Details

### 🔑 Security & Data
- **Passwords**: Hashed using `bcryptjs` (implemented in `auth.ts`).
- **Middleware**: Protected routes ensure users only see content corresponding to their role (`STUDENT`, `TEACHER`, `ADMIN`).
- **Seeding**: A pre-configured `prisma/seed.ts` populates the academy with its first faculty and admin staff.

### 🛸 Real-Time Logic
- **Hook**: `useClassroomSync.ts` manages the WebSocket broadcast logic for the classroom.
- **Webhooks**: `/api/webhook` automatically activates student profiles upon Stripe payment confirmation.

---

## 🚀 4. Deployment Checkpoint
1. **Database**: Connect PostgreSQL via `.env`.
2. **Migrations**: `npx prisma migrate dev`.
3. **Seeding**: `npx prisma db seed`.
4. **Build**: `npm run build`.

**Platform Status: [READY FOR PRODUCTION]**
