# Horus Web

> The browser-based platform of the Horus health ecosystem — a Next.js web application that provides medical identity management, clinical file processing with AI-powered OCR, real-time health monitoring, and a subscription-based store for the Horus wristband.

---

## Table of Contents

1. [Ecosystem Role](#1-ecosystem-role)
2. [What Horus Web Does](#2-what-horus-web-does)
3. [Architecture](#3-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Data Models](#5-data-models)
6. [Project Structure](#6-project-structure)
7. [API Reference](#7-api-reference)
8. [Clinical File Pipeline](#8-clinical-file-pipeline)
9. [Payments](#9-payments)
10. [Running Locally](#10-running-locally)
11. [Environment Variables](#11-environment-variables)
12. [Deployment](#12-deployment)

---

## 1. Ecosystem Role

Horus Web (`horus-braslet`) is the **web companion** of the Horus ecosystem. It shares the same PostgreSQL database and Cloudinary storage as `horus-mobile/server`, and complements the mobile experience with a full desktop/tablet interface.

```
┌─────────────────────────────────────────────────────────────────┐
│                        HORUS ECOSYSTEM                          │
│                                                                 │
│   ┌──────────────┐      ┌──────────────┐     ┌──────────────┐  │
│   │ horus-mobile │◄────►│  horus-web   │     │  horus-watch │  │
│   │  React Native│      │  (this repo) │     │  Wear OS     │  │
│   └──────┬───────┘      └──────┬───────┘     └──────┬───────┘  │
│          │                     │                     │          │
│          └──────────┬──────────┘                     │          │
│                     ▼                                │          │
│             ┌──────────────┐                         │          │
│             │horus-emergency│◄────────────────────────┘          │
│             │  QR Scanner  │                                    │
│             └──────────────┘                                    │
│                                                                 │
│         PostgreSQL · Cloudinary · Firebase · MercadoPago        │
└─────────────────────────────────────────────────────────────────┘
```

**Unique capabilities of Horus Web vs horus-mobile:**

| Capability | horus-web | horus-mobile |
|---|---|---|
| Clinical file upload + AI OCR | ✓ | ✓ (view only) |
| Medical document OCR pipeline | ✓ | — |
| Subscription store + payments | ✓ | — |
| Desktop / tablet UI | ✓ | — |
| Real-time weather + GPS dashboard | ✓ | — |
| 3D interactive assistant (Spline) | ✓ | — |
| AI voice assistant (ElevenLabs) | ✓ | — |
| NFC wristband profile display | ✓ | — |
| Push notifications | — | ✓ |
| Wear OS companion | — | ✓ |

---

## 2. What Horus Web Does

| Feature | Description |
|---|---|
| **Medical Profile** | Complete personal and medical data management — blood type, allergies, chronic conditions, medications, emergency contacts, medical history |
| **Clinical File Manager** | Upload PDFs, images, Word and CSV documents; AI extracts and structures the medical data automatically via OCR |
| **Public Emergency Profile** | NFC-triggered page accessible without login — any phone with NFC can read the wristband and display critical medical data |
| **Health Dashboard** | Real-time GPS location on an interactive map, local weather forecast, and AI health chat |
| **AI Assistant** | Context-aware medical chat powered by OpenAI GPT-4o-mini with ElevenLabs voice synthesis |
| **Subscription Store** | MercadoPago Checkout Pro for purchasing the Horus wristband — order tracking, webhook confirmation, PDF receipt by email |
| **Customization** | Profile photo, theme preferences, privacy controls per data field |
| **Device Management** | Track paired devices, sessions, and security logs |
| **Colombia Emergency Numbers** | Quick-access emergency service directory (123, 132, 119) |

---

## 3. Architecture

```
Next.js 15 (App Router)
│
├── Server Components          → data fetching, no client JS shipped
├── Client Components          → interactive UI (map, chat, file upload, Spline 3D)
├── API Routes (/api/*)        → REST endpoints — auth, profile, files, OCR, payments
├── Middleware                 → JWT cookie verification on protected routes
│
├── Infrastructure layer
│   ├── Prisma ORM             → PostgreSQL queries, typed models
│   ├── Firebase Admin SDK     → Firestore (medical document history / audit trail)
│   ├── Cloudinary SDK         → binary file storage (PDFs, images, documents)
│   ├── OpenAI SDK             → OCR correction, medical text structuring
│   └── ElevenLabs API         → text-to-speech for AI voice assistant
│
└── External services
    ├── MercadoPago SDK v2     → payment processing
    ├── Nodemailer + PDFKit    → purchase confirmation emails with PDF receipt
    ├── Open-Meteo             → weather API (free, no key required)
    └── Nominatim / OSM        → reverse geocoding (GPS → city/country)
```

### Authentication flow

```
POST /api/auth/login
  └─► bcrypt verify password
  └─► issue accessToken (15 min JWT) + refreshToken (7 day JWT)
  └─► set HttpOnly cookies (not accessible to JS)

Protected route request
  └─► Next.js middleware reads cookie
  └─► verify JWT → allow or redirect to /login

POST /api/auth/refresh
  └─► verify refreshToken → issue new accessToken
```

---

## 4. Tech Stack

### Frontend

| Technology | Version | Usage |
|---|---|---|
| Next.js | 15 | App Router, Server Components, API Routes |
| React | 19 | Client-side interactivity |
| TypeScript | 5 | Strict typing throughout |
| Tailwind CSS | 4 | Utility-first styling |
| Spline (`@splinetool/react-spline`) | latest | 3D interactive animations — AI assistant and map background |
| Three.js (`@react-three/fiber`, `@react-three/drei`) | latest | 3D scene management |

### Backend (API Routes)

| Technology | Usage |
|---|---|
| Next.js API Routes | All REST endpoints within the same process |
| OpenAI `gpt-4o-mini` | OCR correction, medical text structuring, medication normalization |
| Google Generative AI | Secondary AI pipeline for document analysis |
| Anthropic SDK | AI assistant fallback / multi-model support |
| ElevenLabs | TTS voice synthesis — model `eleven_flash_v2_5`, Matilda voice |
| Open-Meteo | Real-time weather (free, no API key needed) |
| Nominatim / OSM | Reverse geocoding — lat/lng → city and country name |

### Auth & Security

| Technology | Usage |
|---|---|
| `jsonwebtoken` | Access tokens (15 min) + refresh tokens (7 days) in HttpOnly cookies |
| `bcryptjs` | Password hashing with salt |
| `zod` | API route schema validation |

### Data & Storage

| Technology | Usage |
|---|---|
| PostgreSQL (Neon) | Primary relational database — users, medical profiles, payments |
| Prisma ORM | Schema, migrations, and typed queries — client generated in `src/generated/` |
| Firebase Firestore | Medical document upload history and audit trail |
| Cloudinary | Active file storage (PDFs, images, Word docs) — source of truth for clinical files |

### Payments & Communication

| Technology | Usage |
|---|---|
| MercadoPago SDK v2 | Checkout Pro, payment webhooks |
| Nodemailer | SMTP Gmail — purchase confirmation emails |
| PDFKit | PDF receipt generation attached to confirmation email |

---

## 5. Data Models

```
User
  ├── PersonalInformation
  ├── MedicalProfile
  ├── Allergy[]
  ├── ChronicCondition[]
  ├── UserMedication[]
  ├── EmergencyContact[]
  ├── MedicalHistory[]         ← clinical files (Cloudinary + Firebase)
  ├── ProfileScan[]            ← NFC / QR scan log
  ├── EmergencyAlert[]
  ├── PrivacySettings          ← per-field visibility controls
  ├── UserDevice[]
  ├── DeviceSession[]
  └── SecurityLog[]

Product
  └── Order
        └── Payment
              └── Subscription
```

`PrivacySettings` lets each user control which medical fields are visible on their public emergency profile — blood type, allergies, medications, conditions, and emergency contacts can each be toggled independently.

---

## 6. Project Structure

```
horus-braslet/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # login, register, logout, refresh, session
│   │   │   ├── profile/           # user profile + photo upload
│   │   │   ├── medical-profile/   # allergies, conditions, medications, history
│   │   │   ├── medical-history/   # clinical document CRUD + OCR trigger
│   │   │   ├── files/download/    # secure proxy download from Cloudinary
│   │   │   ├── chat/              # AI health assistant endpoint
│   │   │   ├── colombia/          # emergency numbers directory
│   │   │   ├── contacts/          # emergency contacts CRUD
│   │   │   ├── customization/     # theme and UI preferences
│   │   │   ├── dashboard/         # dashboard data aggregation
│   │   │   ├── devices/           # device and session management
│   │   │   ├── notifications/     # in-app notification records
│   │   │   ├── ocr/               # OCR correction endpoint
│   │   │   ├── payments/          # MercadoPago: create-order, webhook, status
│   │   │   └── subscription/      # subscription status and management
│   │   │
│   │   ├── dashboard/             # Main dashboard — map, weather, AI chat
│   │   ├── archivos/              # Clinical file manager
│   │   ├── profile/               # Personal + medical profile (tabbed)
│   │   ├── medical/               # Medical profile detail view
│   │   ├── tienda/                # Wristband store
│   │   ├── checkout/              # MercadoPago checkout
│   │   ├── payment/               # Payment success / failure / pending pages
│   │   ├── store/                 # Store listing pages
│   │   ├── login/                 # Authentication
│   │   ├── register/              # Account registration
│   │   ├── privacy/               # Privacy policy
│   │   ├── terms/                 # Terms of service
│   │   └── layout.tsx             # Root layout — Pliant + Space Grotesk fonts
│   │
│   ├── components/
│   │   └── FloatingSidebar.tsx    # Vertical floating sidebar (mobile-style nav)
│   │
│   ├── infrastructure/
│   │   ├── ai/
│   │   │   └── openai.ts          # OCR correction, medical text structuring
│   │   ├── cloudinary/            # Upload, download helpers
│   │   ├── database/
│   │   │   ├── prisma/client.ts   # Prisma client (imports from src/generated/)
│   │   │   ├── firebase.ts        # Firebase Admin SDK initialization
│   │   │   └── medicalRecordsRepository.ts
│   │   └── medical-history/       # OCR pipeline, PDF extractor, Word extractor
│   │
│   ├── generated/                 # Prisma client (generated — do not commit)
│   └── config/
│       └── *.json                 # Firebase service account key (do not commit)
│
├── prisma/
│   └── schema.prisma              # Full relational schema
│
├── public/
│   └── fonts/                     # Pliant-Variable.ttf, Pliant-Italic-Variable.ttf
│
├── .env                           # Environment variables (do not commit)
└── next.config.ts                 # Next.js config
```

---

## 7. API Reference

All routes require a valid `accessToken` cookie unless marked public.

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Login — sets HttpOnly JWT cookies |
| `POST` | `/api/auth/logout` | ✓ | Clear session cookies |
| `POST` | `/api/auth/refresh` | — | Refresh access token using refresh cookie |
| `GET` | `/api/auth/session` | ✓ | Return current session user |

### Profile

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profile` | ✓ | Full user + medical profile |
| `PUT` | `/api/profile` | ✓ | Update personal information |
| `POST` | `/api/profile/photo` | ✓ | Upload profile photo to Cloudinary |

### Medical Profile

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET/PUT` | `/api/medical-profile` | ✓ | Blood type, DOB, gender |
| `GET/POST/DELETE` | `/api/medical-profile/allergies` | ✓ | Allergy records |
| `GET/POST/DELETE` | `/api/medical-profile/conditions` | ✓ | Chronic conditions |
| `GET/POST/DELETE` | `/api/medical-profile/medications` | ✓ | Medications |
| `GET/POST/DELETE` | `/api/contacts` | ✓ | Emergency contacts |

### Clinical Files

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/medical-history` | ✓ | List all clinical documents |
| `POST` | `/api/medical-history` | ✓ | Upload file — triggers OCR pipeline |
| `DELETE` | `/api/medical-history/:id` | ✓ | Delete file from Cloudinary + DB |
| `GET` | `/api/files/download/:id` | ✓ | Secure proxy download |

### AI & Dashboard

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat` | ✓ | AI health assistant message |
| `POST` | `/api/ocr` | ✓ | Run OCR correction on uploaded file |
| `GET` | `/api/dashboard` | ✓ | Aggregated dashboard data |
| `GET` | `/api/colombia` | — | Colombia emergency numbers directory |

### Payments

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/payments/create-order` | ✓ | Create MercadoPago Checkout Pro order |
| `POST` | `/api/payments/webhook` | — | MercadoPago webhook (payment confirmation) |
| `GET` | `/api/payments/status/:orderId` | ✓ | Poll payment status |

---

## 8. Clinical File Pipeline

When a user uploads a clinical document, it goes through a multi-stage pipeline:

```
User uploads file (PDF / image / Word / CSV)
        │
        ▼
Cloudinary upload  ──►  store binary, get public_id + url
        │
        ▼
Format detection
  ├── PDF     → pdf-parse → extract raw text
  ├── Image   → Tesseract.js OCR → raw text
  ├── Word    → mammoth → extract raw text
  └── CSV     → parse rows directly
        │
        ▼
OpenAI gpt-4o-mini
  └── Correct OCR errors
  └── Structure into: diagnosis, medications, dates, doctor, institution
        │
        ▼
Firebase Firestore  ──►  save structured record + audit trail
        │
        ▼
PostgreSQL  ──►  save metadata (filename, type, size, cloudinary_id, userId)
```

The structured medical data extracted by AI is stored alongside the original file reference, making it searchable and displayable in the clinical file manager.

---

## 9. Payments

Horus Web integrates **MercadoPago Checkout Pro** for wristband purchases.

**Flow:**

```
/tienda  →  /checkout  →  MercadoPago hosted checkout
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                  /payment/success      /payment/failure
                         │
                         ▼
               POST /api/payments/webhook
                         │
                 ├── Update Order status in DB
                 ├── Create Subscription record
                 └── Send confirmation email
                         │
                         ▼
                  Nodemailer + PDFKit
                  └── PDF receipt attached to Gmail SMTP email
```

For local webhook testing, expose port 3002 with ngrok:

```bash
ngrok http 3002
# Copy the HTTPS URL → set as NEXT_PUBLIC_APP_URL and in MercadoPago webhook config
```

---

## 10. Running Locally

### Prerequisites

```
Node.js >= 18
npm >= 9
PostgreSQL database (Neon recommended)
```

### Install

```bash
git clone <repo-url>
cd horus-braslet
npm install
```

### Generate Prisma client

```bash
npx prisma generate
```

The client is generated into `src/generated/` (not `node_modules`). Run this after any schema change or fresh clone.

### Download Tesseract OCR data (optional)

Required only if using local image OCR:

```bash
npm run download:tessdata
```

### Start development server

```bash
npm run dev
# Available at http://localhost:3002
```

> The app runs on **port 3002** to coexist with other Horus services (`horus-mobile/server` on 3000, `horus-emergency` on 3001).

---

## 11. Environment Variables

Create `.env` in the project root:

```env
# PostgreSQL (Neon or any Postgres provider)
DATABASE_URL="postgresql://user:password@host/dbname"

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# JWT secrets — use long random strings
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."

# MercadoPago (use TEST- prefix for development)
MP_PUBLIC_KEY="TEST-..."
MP_ACCESS_TOKEN="TEST-..."
MP_WEBHOOK_SECRET="..."

# Public URL (ngrok in dev, real domain in production)
NEXT_PUBLIC_APP_URL="https://your-domain.ngrok-free.dev"

# SMTP Gmail for purchase confirmation emails
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_SECURE="true"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"
EMAIL_FROM="your-email@gmail.com"
EMAIL_TO="your-email@gmail.com"

# AI OCR correction (set to false to skip OpenAI and use raw OCR output)
USE_AI_CORRECTION="true"
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords.

### Firebase service account

Place the Firebase Admin SDK credentials JSON at:

```
src/config/<project-name>-firebase-adminsdk-<id>.json
```

To obtain it: Firebase Console → Project Settings → Service Accounts → Generate new private key.

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-...@....iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

This file is in `.gitignore` and must never be committed.

---

## 12. Deployment

Horus Web is a standard Next.js application and can be deployed to any Node.js-compatible host.

**Recommended: Vercel**

```bash
vercel deploy
```

Set all environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

**Self-hosted:**

```bash
npm run build
npm start
# Runs on port 3002 by default
```

Ensure the `DATABASE_URL`, Firebase credentials, and all third-party API keys are available in the production environment before deploying.
