# YCP Business Card Generator

A web application for YCP (Young Corporate Professionals) employees to create, manage, and print digital business cards using organisation-approved templates.

## Features

- Sign in with YCP Microsoft (Azure AD) account — only YCP organisation accounts are permitted
- Create business cards from pre-designed SVG templates
- Manage multiple business cards per user
- Print-ready card output
- Admin panel for managing templates and users

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Auth:** NextAuth.js v4 with Azure AD provider
- **ORM:** Prisma v7
- **Database:** PostgreSQL (Prisma Postgres)

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database
- An Azure AD app registration with the following credentials:
  - Client ID
  - Client Secret
  - Tenant ID

### Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```env
   DATABASE_URL=
   POSTGRES_URL=
   PRISMA_DATABASE_URL=

   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=

   AZURE_AD_CLIENT_ID=
   AZURE_AD_CLIENT_SECRET=
   AZURE_AD_TENANT_ID=
   ```

3. Apply database migrations and seed initial data:

   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed the database with initial templates |

## Database Schema

| Model | Description |
|---|---|
| `User` | Authenticated YCP employees (synced from Azure AD) |
| `Account` | OAuth provider accounts linked to users |
| `Session` | Active user sessions |
| `Template` | SVG-based business card templates managed by admins |
| `BusinessCard` | Individual cards created by users, linked to a template |

## Project Structure

```
app/
├── api/           # API route handlers
├── auth/          # Auth error pages
├── cards/         # Card create/edit/view routes
├── dashboard/     # User dashboard (card list)
├── components/    # Shared UI components
├── lib/           # Auth, Prisma client, helpers
├── layout.tsx
└── page.tsx       # Sign-in landing page
prisma/
├── schema.prisma
└── seed.ts
```

## Authentication

Authentication is handled via NextAuth.js with the Azure AD provider. On first sign-in, a new `User` record is created automatically. Access is restricted to accounts within the configured Azure AD tenant. Soft-deleted users are blocked from signing in.

## User Roles

| Role | Access |
|---|---|
| `USER` | Create and manage own business cards |
| `ADMIN` | Manage templates and all users |
