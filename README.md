# Champions SaaS

Minimal **multi-user SaaS** for browsing **teams** and **matches**, posting **match comments**, and managing content through **role-based backoffice** panels (`EDITOR`, `ADMIN`). Built as the **M0613 IA7** deliverable (block *Creació d'un SaaS*, sessions S16–S20).

**Live demo:** https://YOUR-APP.vercel.app
**Repository:** https://github.com/YOUR_USER/champions-saas

![Home / teams listing](./docs/screenshots/teams.png)

## Why this project

Fans and editors need a single place to **publish** Champions-style fixtures and media, while **registered users** can discuss matches. The app separates **public catalog**, **social features**, and **internal tooling** with clear authorization — a common pattern in real B2B/B2C SaaS products.

## Features

### Public

- Browse **teams** and **matches** with real data from PostgreSQL (via Prisma).
- **Match detail** page with navigation between related entities.

### Authenticated users

- **Sign up** and **sign in** (Auth.js).
- Post **comments** on matches (social layer).

### Backoffice

- **`EDITOR`**: maintain teams, matches, and related media (shields, match images).
- **`ADMIN`**: user and **role** management (`USER`, `EDITOR`, `ADMIN`).

### Product / engineering

- **User stories** implemented incrementally in **Scrum sprints** (US-01 … US-22 — see course backlog).
- **Idempotent seed** for local demos.
- **Supabase Storage** buckets for avatars, team logos, and match images.

## Tech stack

| Layer | Technology |
| ----- | ---------- |
| Framework | **Next.js** (App Router), **React**, **TypeScript** |
| ORM / DB | **Prisma** → **PostgreSQL** (hosted on **Supabase**) |
| Auth | **Auth.js** (NextAuth) |
| Validation | **Zod** |
| UI | **shadcn/ui**, **Tailwind CSS** |
| Media | **Supabase** (Storage + service role on server) |
| Deploy | **Vercel** (app) + **Supabase** (DB, auth, storage) |

## Architecture (high level)

```text
Browser → Next.js (RSC / Server Actions / Route Handlers)
               → Prisma → Supabase Postgres
               → Auth.js (sessions)
               → Supabase Storage (uploads from server)
```

- **Public read** endpoints expose teams/matches for visitors.
- **Mutations** (comments, backoffice CRUD, uploads) run **on the server** with validation and role checks.

## Prerequisites

- **Node.js** LTS (same major as used in class)
- A **Supabase** project (Postgres + Auth + Storage buckets configured)
- **Git**

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USER/champions-saas.git
cd champions-saas
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Never commit `.env`. See **Environment** below for variable meanings.

### 3. Database

```bash
npx prisma migrate dev
npm run db:seed   # if defined — or use the seed command from package.json (e.g. tsx prisma/seed.ts)
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
| -------- | ----------- |
| `DATABASE_URL` | Supabase **pooled** Postgres URL (Prisma client) |
| `DIRECT_URL` | Supabase **direct** URL (migrations) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000` in dev) |
| `NEXTAUTH_SECRET` | Strong random secret for Auth.js |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for Storage / admin APIs |
| `SUPABASE_BUCKET_AVATARS` | Bucket name for user avatars |
| `SUPABASE_BUCKET_TEAMS` | Bucket name for team shields |
| `SUPABASE_BUCKET_MATCHES` | Bucket name for match images |

Full template belongs in **`.env.example`** (without secrets).

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start Next.js in development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npx prisma studio` | Browse database (local) |

(Add `db:seed` / test commands to match your `package.json`.)

## Verification checklist (IA7)

- [ ] Visitor can use **teams** and **matches** public routes with DB-backed data.
- [ ] User can **register** and **log in** without errors.
- [ ] Registered user can **comment** on a match.
- [ ] `EDITOR` can manage teams/matches/media; `ADMIN` can manage users/roles.
- [ ] App deploys to **Vercel**; production env vars set safely.

## Deployment

1. Push to GitHub; connect the repo to **Vercel**.
2. Set all production environment variables in Vercel (same keys as locally).
3. Run migrations against production DB (`prisma migrate deploy` in CI or manually from a trusted environment).

## Roadmap / known limitations

- Billing / subscriptions not included (course scope).
- Rate limiting and advanced observability left for future iterations.

## Academic context

Developed as **IA7 — Kates Serveis web** within **M0613** (DAW2). Product discovery and backlog: **Scrum** (session S19); implementation: guided sprints (session S20), as part of **M0613** (DAW2).

## License

Educational use — specify your license here (e.g. MIT, or “all rights reserved” for classroom-only work).

## Author

**Your Name** — [Portfolio](https://YOUR-PORTFOLIO.com) · [LinkedIn](https://www.linkedin.com/in/YOUR_PROFILE)