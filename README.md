# StayInn — Full-Stack Hotel Booking Platform

StayInn is a production-grade hotel booking marketplace built with **Next.js 16, TypeScript, MongoDB, Clerk Authentication, Stripe Payments, Cloudinary, and Google Gemini AI**.

It supports multi-role workflows (Customer, Owner, Admin), property management, booking and payment processing, AI-assisted content generation, and secure webhook-driven synchronization.

---

## Live Demo

**Production:** `https://stayinn-booking-platform.vercel.app/`

---

## Features

### Authentication & Authorization

* Clerk authentication (Email/Password + Google OAuth)
* Server-side route protection with `auth.protect()`
* Role-based access control (Customer / Owner / Admin)
* Webhook-based user synchronization with MongoDB

### Customer Features

* Browse hotel properties
* View room details and amenities
* Search and filter properties
* Create bookings
* Secure Stripe checkout
* View booking history

### Owner Features

* Submit owner request
* Create and manage properties
* Upload property images
* Manage room inventory
* View owner bookings

### Admin Features

* Review owner requests
* Approve or reject owner applications
* Manage users
* Manage platform properties

### AI Features

* AI-generated property descriptions
* AI travel assistant chat
* Powered by **Google Gemini API**

### Payments

* Stripe Checkout integration
* Webhook-driven booking confirmation
* Pending checkout reservation system
* Race-condition-safe availability checks
* Automatic cleanup of abandoned checkouts

---

## Tech Stack

### Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

### Backend

* Next.js Route Handlers
* Server Actions
* MongoDB
* Mongoose

### External Services

* Clerk
* Stripe
* Cloudinary
* Google Gemini API

---

## Architecture Highlights

### Resource-Based Authentication

The project follows Clerk's latest 2026 recommendation:

* Minimal `proxy.ts`
* Authentication enforced at the **resource level**
* `await auth.protect()` used inside layouts, pages, route handlers, and server actions

### Webhook Synchronization

Clerk events:

* `user.created`
* `user.updated`
* `user.deleted`

User identity fields are mirrored exactly from Clerk while application roles remain controlled by MongoDB.

### Payment Flow

Property → Pending Checkout → Stripe Session → Stripe Webhook → Booking Creation

The webhook is the source of truth for payment completion.

---

## Getting Started

### Prerequisites

* Node.js 20+
* MongoDB Atlas
* Clerk account
* Stripe account
* Cloudinary account
* Google AI Studio account

### Installation

```bash
git clone https://github.com/rk4-logic/stayinn-booking-platform.git
cd stayinn
npm install
```

### Environment Variables

Create a `.env` file:

```env
MONGODB_URI=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

GEMINI_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Project Structure

```text
app/
  (public)/
  (protected)/
  api/
components/
actions/
services/
models/
lib/
types/
store/
hooks/
proxy.ts
```

---

## Stripe Local Testing

Install Stripe CLI and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use Stripe test card:

```text
4242 4242 4242 4242
Any future expiry date
Any CVC
Any ZIP
```

---

## Deployment

### Vercel

Deploy the **develop** branch for staging and **main** for production.

### Production Webhooks

#### Clerk

```text
https://your-domain.vercel.app/api/webhooks/clerk
```

#### Stripe

```text
https://your-domain.vercel.app/api/stripe/webhook
```

---

## Security Considerations

* Server-side authorization checks
* Webhook signature verification (Svix + Stripe)
* Atomic MongoDB upserts
* Role preservation during profile synchronization
* No client-side trust for privileged operations
* Availability revalidation before booking confirmation

---

## Development Workflow

```text
feat/*  →  develop  →  main
```

* `feat/*` — feature branches
* `develop` — integration/staging
* `main` — production-ready code

---

## Future Improvements

* Email notifications
* Review & rating system
* Map integration
* Multi-currency support
* Refund management dashboard
* Background job processing
* Analytics dashboard

---

## Author

**Rohit Prajapati**

* Full-Stack Developer
* React / Next.js / Node.js / TypeScript / MongoDB

---

## License

This project is built for educational, portfolio, and demonstration purposes.
