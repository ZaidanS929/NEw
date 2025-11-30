# Rouge — Next.js + NextAuth (converted)

This project was generated from your uploaded Rouge SPA and converted into a Next.js app that:
- Protects the site with Google & Apple sign-in using NextAuth.
- Loads your original SPA inside an iframe at `/rouge-app/index.html` for minimal changes.
- Provides a `/api/proxy` route (included) if you want to proxy an external upstream site (set UPSTREAM_SITE).

## How it is structured

- `components/` — original TSX files you uploaded.
- `public/rouge-app/` — original `index.html` and `index.css` so the app loads inside an iframe.
- `pages/` — Next.js pages:
  - `index.tsx` — protected entry; shows sign-in buttons or iframe.
  - `api/auth/[...nextauth].ts` — NextAuth configuration.
  - `api/proxy.ts` — proxy with HTML rewriting.

## Environment variables (set in Vercel Dashboard)

- NEXTAUTH_URL=https://YOUR_VERCEL_DOMAIN
- NEXTAUTH_SECRET=long_random_string
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- APPLE_CLIENT_ID
- APPLE_TEAM_ID
- APPLE_KEY_ID
- APPLE_PRIVATE_KEY
- UPSTREAM_SITE (optional; set if using proxy)

## Deploy to Vercel

1. Commit this repository to GitHub.
2. Import it into Vercel (https://vercel.com/new).
3. Add environment variables in Project Settings.
4. Deploy.

If you'd like, I can:
- Replace the iframe approach with a full Next.js page that renders your components directly.
- Add asset copying, image handling, or more advanced proxy behavior.

