# RentalCar

A car rental web app built from a Figma design: browse the catalog, filter cars
on the server, load more results page by page, open a car's details in a new tab
and send a booking request.

**Live demo:** https://rental-car-hontonoran.vercel.app

## Features

- **Home page (`/`)** — hero section with a `View Catalog` call to action.
- **Catalog (`/catalog`)** — grid of cars with server-side filtering by brand,
  price per hour and mileage range. Filters live in the URL
  (`/catalog?brand=Buick&price=40&minMileage=1000&maxMileage=6000`), so a
  filtered catalog can be shared, bookmarked and reloaded.
- **Load more pagination** — `useInfiniteQuery` from TanStack Query appends the
  next page of cars while keeping the active filters.
- **Car details (`/catalog/[carId]`)** — full specifications, rental conditions,
  features and a photo. Opens in a new browser tab from the catalog card.
- **Booking form** — Formik + Yup validation; a successful request shows a
  toast notification.
- **Favorites (`/favorites`)** — save cars with the heart on a card. Saved ids
  are kept in `localStorage` and the header shows how many cars are saved.
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
| Icons | React Icons (Lucide, Octicons) |
| Notifications | React Hot Toast |
| Fonts | `next/font` — Manrope |
| Hosting | Vercel |

The API is the GoIT car rental backend: `https://car-rental-api.goit.study`.

## Architecture

Server Components do the data fetching, Client Components own the interaction.

- `app/catalog/page.tsx` (Server) reads the filters from `searchParams`,
  prefetches the cars and the filter options into a `QueryClient` and passes the
  dehydrated cache down through `HydrationBoundary`.
- `app/catalog/CatalogClient.tsx` (Client) subscribes to the same query keys, so
  the first paint already shows data, then handles Load more and filter changes.
- `app/catalog/[carId]/page.tsx` (Server) fetches one car and renders the
  details; only the booking form is a Client Component.
- `lib/queries.ts` holds the shared query definitions so the server and the
  client can never drift apart.

```
app/            routes, layouts, metadata
components/     UI components, each with its own CSS module
hooks/          useFavorites (localStorage + useSyncExternalStore)
lib/            api client, query options, filter helpers, formatting
providers/      TanStack Query provider
types/          shared API types
```

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
