# RentalCar

A car rental web app built from a Figma design: browse the catalog, filter cars
on the server, load more results page by page, open a car's details in a new tab
and send a booking request.

**Live demo:** https://rental-car-hontonoran.vercel.app

## Features

- **Home page (`/`)** — hero section with a `View Catalog` call to action, and
  a "Recently viewed" strip of the last cars you opened (kept in
  `localStorage`, hidden until there is history to show).
- **Catalog (`/catalog`)** — grid of cars filtered by brand, price per hour and
  mileage range on the backend, plus a city filter. The API has no server-side
  support for city, so picking one fetches every page matching the other
  filters and narrows it client-side instead; "Kyiv"/"Kiev" and
  "Odesa"/"Odessa" are merged into one option since the dataset spells the same
  city both ways. Filters live in the URL
  (`/catalog?brand=Buick&price=40&city=Kyiv`), so a filtered catalog can be
  shared, bookmarked and reloaded.
- **Load more pagination** — `useInfiniteQuery` from TanStack Query appends the
  next page of cars while keeping the active brand/price/mileage filters.
- **Car details (`/catalog/[carId]`)** — full specifications, rental conditions,
  features and a photo. Opens in a new browser tab from the catalog card.
- **Booking form** — Formik + Yup validation, including a pick-up/return date
  range (`react-datepicker`). The API only stores a free-text comment, so the
  dates are folded into it before the request is sent. A successful request
  shows a toast notification.
- **Favorites (`/favorites`)** — save cars with the heart on a card. Saved ids
  are kept in `localStorage` and the header shows how many cars are saved.
- **Dark mode** — a header toggle switches between light and dark palettes,
  defaulting to the system preference on first visit. The choice is applied
  before the first paint, so there is no flash of the wrong theme.
- **Loading and error states** — a custom loader over a skeleton grid, an
  illustrated "no cars found" state and an error boundary with a retry action.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Data fetching | TanStack Query (`useInfiniteQuery`) + Axios |
| Styling | CSS Modules with design tokens in `app/globals.css` |
| Forms | Formik + Yup |
| Dates | react-datepicker |
| Icons | React Icons (Lucide, Octicons) |
| Notifications | React Hot Toast |
| Fonts | `next/font` — Manrope |
| Hosting | Vercel |

The API is the GoIT car rental backend: `https://car-rental-api.goit.study`.

## Quality check

The deployed version was checked with Lighthouse on desktop:

| Metric | Score |
| --- | --- |
| Performance | 100 |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

Audit screenshots:
[docs/lighthouse/perfomance_results.png](./docs/lighthouse/perfomance-results.png)
[docs/lighthouse/darkmode_perfomance_results.png](./docs/lighthouse/darkmode_perfomance_results.png)

## Architecture

Server Components do the data fetching, Client Components own the interaction.

- `app/catalog/page.tsx` (Server) reads the filters from `searchParams` and
  prefetches into a `QueryClient`: the paginated `useInfiniteQuery` when no
  city is picked, or every matching page at once when it is — so the client
  never fetches something the server hasn't already warmed up.
- `app/catalog/CatalogClient.tsx` (Client) subscribes to the same query keys, so
  the first paint already shows data, then handles Load more, filter changes
  and the city narrowing.
- `app/catalog/[carId]/page.tsx` (Server) fetches one car and renders the
  details; the booking form and the "recently viewed" tracker are the only
  Client Components on the page.
- `lib/queries.ts` holds the shared query definitions so the server and the
  client can never drift apart.

```
app/            routes, layouts, metadata
components/     UI components, each with its own CSS module
hooks/          useFavorites, useRecentlyViewed, useTheme — all localStorage
                + useSyncExternalStore
lib/            api client, query options, filter helpers, city
                normalisation, formatting
providers/      TanStack Query provider
types/          shared API types
```

### Assets

`app/icon.svg`, `app/apple-icon.png` and `app/opengraph-image.jpg` are Next.js
file conventions: their names alone generate the favicon, the iOS touch icon
and the social preview card, so they must stay in `app/` under exactly those
names. Renaming one silently removes the corresponding tag from `<head>`.

Images that components import — `hero-car.jpg`, `no-cars-found.png` — live in
`public/` and are served through `next/image` as optimised WebP.

## Getting started

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/hontonoran/rental-car.git
cd rental-car
npm install
npm run dev
```

The app runs at http://localhost:3000.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler |

### Environment variables

None are required. `NEXT_PUBLIC_SITE_URL` can be set to the deployed origin so
that metadata links resolve to absolute URLs; it defaults to the Vercel URL.

## Language

This README is also available in [Ukrainian](./README.uk.md).

## Author

Anastasiia Kuzmina — [github.com/hontonoran](https://github.com/hontonoran)
