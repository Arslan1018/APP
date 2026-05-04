# System Architecture — AR Menu Platform

## Overview

The AR Menu Platform is a multi-tenant SaaS application where restaurants onboard, upload their menu items with 3D models, generate QR codes, and customers scan those codes to experience AR food previews and place orders.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Next.js Web │  │  React Native│  │  AR WebXR     │ │
│  │  Dashboard   │  │  Mobile App  │  │  Viewer       │ │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘ │
└─────────┼─────────────────┼──────────────────┼─────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY                           │
│                  Express REST API                        │
│              (Rate Limiting, Auth Middleware)            │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│  Auth Service│ │Menu Service │ │Order Service │
│  JWT/Refresh │ │Items/QR/AR  │ │Cart/Checkout │
└──────────────┘ └─────────────┘ └──────────────┘
        │               │               │
        ▼               ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│   PostgreSQL (Prisma)  │  Redis Cache  │  AWS S3         │
│   Primary DB           │  Sessions/QR  │  3D Models      │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema (ERD)

```
Restaurant (1) ──── (N) Menu
Menu (1) ──── (N) MenuItem
MenuItem (1) ──── (1) ARModel
MenuItem (1) ──── (N) QRCode
QRCode (1) ──── (N) QRScan
Restaurant (1) ──── (N) Order
Order (1) ──── (N) OrderItem
OrderItem (N) ──── (1) MenuItem
User (1) ──── (N) Order
Restaurant (1) ──── (1) User [owner]
```

---

## API Routes

### Auth
- `POST /api/auth/register` — Restaurant owner signup
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh JWT
- `POST /api/auth/logout` — Logout

### Restaurants
- `GET  /api/restaurants/:id` — Get restaurant public profile
- `PUT  /api/restaurants/:id` — Update restaurant (auth)
- `GET  /api/restaurants/:id/analytics` — Dashboard analytics

### Menus
- `GET  /api/menus/:restaurantId` — Get all menus
- `POST /api/menus` — Create menu
- `PUT  /api/menus/:id` — Update menu
- `DELETE /api/menus/:id` — Delete menu

### Menu Items
- `GET  /api/items/:menuId` — Get items for menu
- `POST /api/items` — Create item (with 3D model upload)
- `PUT  /api/items/:id` — Update item
- `DELETE /api/items/:id` — Delete item
- `GET  /api/items/:id/ar` — Get AR data for item (public)

### QR Codes
- `POST /api/qr/generate/:itemId` — Generate QR for item
- `GET  /api/qr/:code` — Resolve QR → AR experience
- `POST /api/qr/:code/scan` — Track scan event

### Orders
- `POST /api/orders` — Create order
- `GET  /api/orders/:id` — Get order status
- `GET  /api/orders/restaurant/:id` — Get restaurant orders
- `PUT  /api/orders/:id/status` — Update order status

### Payments
- `POST /api/payments/intent` — Create Stripe payment intent
- `POST /api/payments/webhook` — Stripe webhook

---

## Security Architecture

- **JWT Auth** with 15-min access tokens + 7-day refresh tokens
- **RBAC** — Roles: `SUPER_ADMIN`, `RESTAURANT_OWNER`, `STAFF`, `CUSTOMER`
- **Rate Limiting** — 100 req/min per IP, 1000/min per authenticated user
- **Input Validation** — Zod schemas on all endpoints
- **CORS** — Whitelisted origins only
- **Helmet.js** — Security headers
- **bcrypt** — Password hashing (rounds: 12)
- **SQL Injection** — Prisma parameterized queries
- **XSS** — DOMPurify on frontend, sanitize-html on backend
- **File Upload** — MIME type validation, size limits, virus scan placeholder
- **Secrets** — Environment variables, never in code

---

## Scalability Strategy

- **Horizontal scaling** via Docker + Kubernetes
- **CDN** for 3D model assets (CloudFront)
- **Redis** for session caching and QR code lookup
- **Database read replicas** for analytics queries
- **Queue** (Bull/Redis) for email, notifications, analytics events
- **WebSockets** for real-time order status updates
