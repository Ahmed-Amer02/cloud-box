# CloudBox frontend

React + TypeScript + Vite + Tailwind v4 frontend for the CloudBox API.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `VITE_API_BASE_URL` — your backend's base URL (e.g. `http://localhost:3000/api`)
- `VITE_SUPABASE_URL` — already set to the CloudBox Supabase project
- `VITE_SUPABASE_ANON_KEY` — your Supabase project's anon/public key (Project Settings → API)

```bash
npm run dev
```

Open the printed local URL. You should see a "CloudBox scaffold is running" page with the
Space Grotesk / IBM Plex Sans / IBM Plex Mono type system and a strip of the design token colors.
