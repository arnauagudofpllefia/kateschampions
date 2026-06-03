# Champions Hub (IA7)

Aplicacion SaaS multiusuario de Champions con:

- Catalogo publico de equipos y partidos.
- Registro/login con Auth.js (credenciales).
- Comentarios en detalle de partido para usuarios autenticados.
- Backoffice por rol: `EDITOR` (equipos/partidos) y `ADMIN` (usuarios/roles).

## Stack

- Next.js (App Router), React, TypeScript.
- Supabase Postgres (migraciones SQL con Supabase CLI).
- Auth.js (NextAuth, estrategia JWT + Credentials).
- Zod para validacion de mutaciones.
- Tailwind CSS.

## Funcionalidades

### Publico

- Listado de equipos.
- Listado de partidos por dia.
- Resultados y clasificacion.
- Detalle de partido (`/partidos/[id]`).

### Usuarios autenticados

- Registro (`/register`) y login (`/login`).
- Publicar comentarios en el detalle de partido.

### Backoffice por roles

- `EDITOR`: mantenimiento de equipos (nombre, escudo, entrenador, estadio) y partidos (fecha, hora, estado y marcador).
- `ADMIN`: gestion de roles de usuario (`user`, `editor`, `admin`).

## Rutas principales

- `/`
- `/equipos`
- `/equipos/[id]`
- `/partidos`
- `/partidos/[id]`
- `/resultados`
- `/clasificacion`
- `/login`
- `/register`
- `/backoffice/editor`
- `/backoffice/admin`

## API principal

- `GET /api/equipos`
- `GET /api/equipos/[id]`
- `GET /api/partidos`
- `GET /api/partidos/[id]`
- `GET /api/partidos/[id]/comentarios`
- `POST /api/partidos/[id]/comentarios`
- `GET /api/resultados`
- `GET /api/clasificacion`
- `POST /api/auth/register`

## Requisitos previos

- Node.js LTS.
- Proyecto de Supabase enlazado con el repo.

## Instalacion

```bash
npm install
```

## Configuracion de entorno

1. Copia `.env.example` a `.env`.
2. Rellena valores reales de Supabase/Auth.

Variables usadas:

- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `DATABASE_URL` (si usas Prisma en fases posteriores)
- `DIRECT_URL` (si usas Prisma en fases posteriores)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (opcional para storage/admin server)

## Migraciones

```bash
npx supabase db push
```

## Arranque

```bash
npm run dev
```

## Credenciales demo

- Usuario: `demo@champions.local` / `demo123`
- Editor: `editor@champions.local` / `editor123`
- Admin: `admin@champions.local` / `admin123`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Checklist IA7

- [x] Visitor usa rutas publicas de equipos/partidos con datos de BD.
- [x] Usuario puede registrarse y loguearse sin errores.
- [x] Usuario autenticado puede comentar en partidos.
- [x] `EDITOR` mantiene equipos/partidos y `ADMIN` gestiona usuarios/roles.
- [x] Despliegue en Vercel y variables de produccion (pendiente segun entorno final).