# Gift Card Contest (Next.js + Statsig)

A small demo app built with Next.js App Router that collects contest entries and integrates Statsig for analytics and experimentation. Users pick a preferred gift card (Sephora or Chipotle) and submit a Venmo username; entries are persisted to a JSON file on the server.

## Live Site

- Deployed on Vercel: https://v0-statsig-react-integration.vercel.app
- Repository: https://github.com/rsgenack/giftcard-contest-test

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Statsig React Bindings (`@statsig/react-bindings`)

## Features

- Contest UI with two gift card options and a simple entry form
- Server routes:
  - `app/api/check-duplicate` checks for duplicate Venmo usernames (case/`@` insensitive)
  - `app/api/submit-entry` writes entries to `data/contest-entries.json`
- Admin page at `app/admin` listing entries with simple stats
- Statsig integration with a stable user ID

## Getting Started

1) Install dependencies

```bash
pnpm install
```

2) Set your Statsig client SDK key

- Create a `.env.local` file
- Add `YOUR_CLIENT_API_KEY=your_client_key_here`

3) Run the dev server

```bash
pnpm dev
```

Open http://localhost:3000

## Build

```bash
pnpm build && pnpm start
```

## Statsig Integration

- Stable User ID helper: `utils/getStableUserID.ts`
  - Returns a consistent ID per browser via `localStorage`; returns `"server"` during SSR.
- App initialization: `app/page.tsx`
  - Wraps the app with `StatsigProvider` using `process.env.YOUR_CLIENT_API_KEY` and `{ userID: getStableUserID() }`
  - Logs a `page_loaded` event on hydration
- Event logging adjustments (PII-safe): `components/contest-form.tsx`
  - `venmo_provided` → `1` with `{ provided: true }`
  - `contest_entry` → `1` with `{ gift_card_choice, submitted: true }`
  - `gift_card_selected` → `1` with `{ gift_card_choice }` on selection

## Notes

- Entries are stored in `data/contest-entries.json` on the server. This is for demo purposes only.
- Duplicate detection normalizes Venmo usernames by trimming and removing a leading `@`.
- If building on CI, you may need to approve native builds for optional deps (`pnpm approve-builds`).

## License

MIT
