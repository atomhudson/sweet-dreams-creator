# 🌱 Bhoomi Bandhan

**Empowering Farmers, Connecting Markets — Secure Your Harvest, Grow Your Future.**

Bhoomi Bandhan is a contract farming platform that bridges the gap between farmers and contractors. Farmers can list their lands, receive contract proposals, and manage agreements — while contractors can browse available lands and send proposals. Admins oversee the entire ecosystem with user management, contract approvals, and system-wide dashboards.

## Features

- **Farmer Dashboard** — Add and manage lands, view contracts, track notifications
- **Contractor Dashboard** — Browse available lands, send contract proposals, manage proposals
- **Admin Panel** — User management, contract approvals, land oversight, add contractor accounts
- **Role-Based Access Control** — Secure RLS policies with farmer / contractor / admin roles
- **Real-Time Notifications** — Stay updated on contract status changes and proposals
- **Responsive Design** — Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend** — React, TypeScript, Vite
- **UI** — shadcn/ui, Tailwind CSS, Lucide Icons
- **Backend** — Supabase (Auth, Database, Row Level Security)
- **State Management** — React Query, React Context

## Getting Started

### Prerequisites

- Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase project with the migrations applied

### Setup

```sh
# Clone the repository
git clone https://github.com/atomhudson/sweet-dreams-creator
cd sweet-dreams-creator

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```

### Database Setup

Run the SQL migrations in your Supabase Dashboard → SQL Editor in order:

1. `supabase/migrations/20260210093320_*.sql` — Core schema (tables, RLS, triggers)
2. `supabase/migrations/20260210093412_*.sql` — Notification policy updates
3. `supabase/migrations/20260210100000_*.sql` — Cross-role profile visibility

## User Roles

| Role | Description |
|------|-------------|
| **Farmer** | Registers via the auth page. Can add lands, view/create contracts, receive proposals. |
| **Contractor** | Created by admin. Can browse available lands, send proposals, manage contracts. |
| **Admin** | Created via SQL. Oversees all users, contracts, lands. Can approve/reject contracts. |

## Project Structure

```
src/
├── components/       # Reusable UI components (Header, Footer, ProtectedRoute)
├── contexts/         # AuthContext for authentication state
├── hooks/            # Custom React hooks
├── integrations/     # Supabase client & types
├── pages/            # Route pages (Dashboard, AdminPage, ContractsPage, etc.)
└── assets/           # Static images
```

## License

This project is open source.
