# Gabriel Myeye Portfolio

A modern portfolio web app with a public site and a Supabase-powered admin CMS.

## Features

### Public Site
- Hero, About, Projects, Skills, Certificates, Experience/Education, Contact sections
- Contact form submission to Supabase
- CV download support from profile settings
- Gallery section driven by published gallery records
- Visitor tracking (page views + unique sessions)

### Admin Dashboard
- Supabase email/password authentication
- CRUD for Projects, Certificates, Blog Posts, Gallery, Experience, Education, Skills
- Contact message inbox (read/delete)
- Profile and CV settings
- Dashboard metrics (content counts + visitor analytics)

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion + GSAP
- Supabase (PostgreSQL, Auth, Storage)

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Supabase account

### Install
```bash
cd app
npm install
cp .env.example .env
```

Set environment variables in `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run locally:
```bash
npm run dev
```

## Supabase Setup

Run the SQL schema in this order:
1. Full schema:

```text
supabase/schema.sql
```

2. (Optional) If you already had an older schema, apply only the patch:

```text
supabase/visitors_and_contact_policies.sql
```

Storage bucket:
- `portfolio-media` (public)

Suggested folders:
- `projects/`
- `certificates/`
- `gallery/`
- `posts/`
- `profile/`

## Build
```bash
npm run build
```

## Deployment
Deploy the `app/` project to Vercel or Netlify with:
- Build command: `npm run build`
- Output dir: `dist`
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Detailed Setup
See `SETUP.md` for step-by-step instructions.
