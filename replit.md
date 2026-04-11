# Skymark Eatery Platform

## Overview

Full-stack Italian restaurant platform for **Skymark Eatery by Caffé É Pranzo** (2630 Skymark Ave., Unit 102, Mississauga). Built as a pnpm monorepo using TypeScript.

## Project Structure

| Path | Purpose |
|---|---|
| `artifacts/api-server` | Express 5 REST API backend |
| `artifacts/skymark-eatery` | React + Vite customer-facing web app |
| `lib/db` | PostgreSQL + Drizzle ORM shared DB package |

## Tech Stack

- **Monorepo**: pnpm workspaces
- **API**: Express 5, Fastify-logger (pino)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs, stored in localStorage
- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui, Wouter routing
- **Payments**: Stripe (keys not yet configured)
- **AI**: Anthropic Claude via Replit AI Integrations proxy

## Features Built

### Customer Site
- Homepage with CSS 3D animated hero (floating food emojis + orbs/rings, no Three.js)
- Logo in white card (h-24/h-32 hero, h-16 navbar); navy gradient background
- Full menu with categories, food images, dietary info, pricing
- Menu page shows rewards promo banner for guests (15% off, 30 days)
- Cart + checkout with 15/25-min order windows (peak hours 11am–1pm)
- Order status tracking page (`/order/:id`)
- Login / Signup / Admin Login pages
- Custom 404 Not Found page ("dish isn't on the menu" with Back to Home / View Menu buttons)

### Rewards Program
- **Auto-claimed on signup**: every new customer gets 15% off for 30 days automatically
- Dismissible banner shown on homepage for logged-in customers with active rewards
- Guest promo badge in hero and guest promo bar on menu page (drives signups)
- API: `GET /api/rewards/me` (current reward), `POST /api/rewards/claim`

### Subscription Plans
- Weekly (2 free meals/wk + 20% discount), Bi-weekly (4 free meals + 20%), Monthly (6 free meals + 20%)
- Admin-only page at `/admin/subscriptions` with plan cards and active subscriber list
- Corporate catering section — requires intake meeting, contact (905) 206-5550
- API: `GET /api/rewards/subscriptions`

### Admin Dashboard (`/admin`)
- Auth-guarded — unauthenticated users redirected to `/admin-login`
- Dashboard with live metrics
- Order management with status updates
- Menu editor with AI-powered description generation, `isFeatured` badge support
- Daily specials management
- Finance tracking (A/R revenue + A/P expenses)
- Subscriptions management page (admin-only)
- Developer test order panel — only visible for `role === "developer"`

### Kitchen Display (`/kitchen`) — Staff Protected
- McDonald's-style dark-mode real-time board
- "New Orders" and "In Kitchen" dual columns
- Color-coded urgency indicators (green → orange → red)
- Auto-refreshes every 8 seconds
- New order alert pulse notification
- "Start Preparing" / "Ready for Pickup" actions

### Order Status Board (`/order-board`) — Staff Protected
- Public-facing display showing in-progress and ready orders
- Requires staff, admin, or developer role to access

### Auth System
- JWT-based, 7-day expiry, stored in localStorage
- Roles hierarchy: `developer` > `admin` > `staff` > `customer`
- `ADMIN_ROLES = ["admin", "developer"]` — can access all `/admin/*` routes
- `STAFF_ROLES = ["admin", "developer", "staff"]` — can access `/kitchen` and `/order-board`
- `useAuth.login()` and `useAuth.signup()` return the `User` object for role-based routing
- `RequireAdmin` wraps all `/admin/*` routes; `RequireStaff` wraps `/kitchen` and `/order-board`

### Seeded Accounts (auto-created on every startup via `seed-admin.ts`)
| Account | Password | Role | Access |
|---|---|---|---|
| `jrattan@devantadigital.com` | `Jenhson587499!` | `developer` | Full admin + test orders panel |
| `skymarkeatery@gmail.com` | `password2026` | `staff` | Kitchen Display + Order Board only |

### Navigation
- Guests: Sign In + Create Account buttons
- Staff: Kitchen Display + Order Status Board in dropdown/mobile menu
- Admin/Developer: Admin Dashboard + Kitchen Display + Order Status Board
- Admin Login (`/admin-login`): redirects staff → `/kitchen`, admin/developer → `/admin`
- "Order Status" link removed from public navbar (staff-only access)

### Developer Tools
- `POST /api/orders/test` — requires `role === "developer"`, inserts randomized `[TEST]` prefixed orders
- Test order panel in admin dashboard (only renders for `role === "developer"`)

## Brand Guidelines
- **Primary**: Navy Blue `hsl(215 60% 23%)`
- **Secondary**: Italian Red `hsl(0 72% 48%)`
- **Accent**: Italian Green `hsl(142 45% 38%)`
- **Logo**: `/logo.webp` — wrap in `bg-white rounded-xl px-6 py-3` for dark backgrounds
- **Font**: DM Sans (body), Playfair Display (headings/serif)

## Navigation Notes
- Use `window.location.href` for post-logout navigation (NOT `useLocation` from wouter — dispatcher error)
- All admin routes: use `<RequireAdmin>` wrapper component
- Kitchen/Order Board: use `<RequireStaff>` wrapper component

## Image Notes
- Broken images are fixed directly in the DB via SQL (not in seed files)
- Macchiato fixed: `photo-1541167760496-1628856ab772`
- Avocado Toast fixed: `photo-1588137378633-dea1336ce1e2`
- All images use Unsplash `?w=400&q=80` for optimized delivery

## Key Commands

```bash
pnpm --filter @workspace/db run push      # Push DB schema changes
pnpm --filter @workspace/api-server run dev  # Run API server
pnpm --filter @workspace/skymark-eatery run dev  # Run frontend
```

## DB Schema Tables
- `users` — auth (email, passwordHash, name, role, isActive)
- `menu_items` — items with category, price, imageUrl, allergens, isFeatured, etc.
- `categories` — menu sections (Antipasti, Pasta, etc.)
- `orders` — customer orders with status, estimatedReadyAt
- `order_items` — line items per order
- `specials` — daily specials
- `expenses` — A/P expense tracking
- `rewards` — customer rewards (percentOff, expiresAt, isActive)
- `subscriptions` — customer subscriptions (plan, status, nextBillingDate)
- `conversations` / `messages` — AI chat history

## Environment Secrets
- `SESSION_SECRET` — used as JWT signing key
- `STRIPE_PUBLISHABLE_KEY` — (not yet set)
- `STRIPE_SECRET_KEY` — (not yet set)

## Pending / Upcoming
- Stripe payment integration (keys needed)
- Mobile Expo app (not yet created)
