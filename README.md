# 🍽️ AR Menu — Augmented Reality Restaurant Menu Platform

A full-stack platform that lets restaurants create AR-powered menus. Customers scan a QR code and see 3D food models floating in real space, then order directly from their phone.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Three.js, WebXR |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT + Refresh Tokens |
| Storage | AWS S3 (3D models, images) |
| Cache | Redis |
| Mobile | React Native (Expo) |
| AR | Three.js + WebXR API + model-viewer |
| Payments | Stripe |
| Deploy | Docker + Vercel (frontend) + Railway (backend) |

---

## 📁 Project Structure

```
APP/
├── frontend/          # Next.js web app + AR viewer
├── backend/           # Express REST API
├── mobile/            # React Native Expo app
├── docs/              # Architecture docs
└── scripts/           # DB seed, deploy scripts
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL

### 1. Clone & Install
```bash
git clone https://github.com/Arslan1018/APP.git
cd APP
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npx prisma migrate dev
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### 4. Docker (Full Stack)
```bash
docker-compose up --build
```

---

## 🌟 Core Features

- **QR Code Generation** — Each menu item gets a unique scannable QR
- **AR Viewer** — WebXR-based 3D food visualization in real space
- **Restaurant Dashboard** — Manage menus, items, 3D models, orders
- **Online Ordering** — Cart, checkout, Stripe payments
- **Analytics** — Scan counts, order rates, popular items
- **Multi-language** — i18n support

---

## 🏗️ Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full system design.

---

## 📄 License

MIT
