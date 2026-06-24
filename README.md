# Wayfare

Wayfare is a full-stack group trip planning app built for Vercel with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/Postgres/RLS, and Google Maps Platform.

## Features

- Supabase Auth sign up, login, and logout
- Dashboard of trips visible through Supabase Row-Level Security
- Trip creation and member invites by email
- Google Places autocomplete for proposals with `lat`, `lng`, and `google_place_id`
- Proposal voting backed by Supabase
- Day-by-day itinerary scheduling and a Google Map of scheduled stops
- Shared expenses with even splits across trip members
- Unit-tested settlement function that reduces balances to the fewest payments

## Database

Apply the initial migration in `supabase/migrations/0001_init.sql`. It creates:

- `trips`
- `trip_members`
- `proposals`
- `votes`
- `itinerary_items`
- `expenses`
- `expense_splits`
- `profiles`

The migration enables RLS on app tables so authenticated users can only read and write trip data for trips they belong to.

## Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run build
npm test
```

`npm run build` performs TypeScript validation in this environment. On Vercel, install the dependencies from `package.json`; Vercel detects `framework: nextjs` from `vercel.json` and deploys the App Router project as a Next.js app.
