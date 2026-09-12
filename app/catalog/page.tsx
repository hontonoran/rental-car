import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  noop,
} from "@tanstack/react-query";
import CatalogClient from "./CatalogClient";
import { parseFilters, withoutCity } from "@/lib/filters";
import type { RawSearchParams } from "@/lib/filters";
import {
  allCarsQueryOptions,
  carCitiesQueryOptions,
  carFiltersQueryOptions,
  carsQueryOptions,
} from "@/lib/queries";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse every car available at RentalCar and filter by brand, price per hour and mileage.",
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: "Catalog | RentalCar",
    description:
      "Browse every car available at RentalCar and filter by brand, price per hour and mileage.",
    url: "/catalog",
    siteName: SITE_NAME,
    type: "website",
    images: [OG_IMAGE],
  },
};

interface CatalogPageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = parseFilters(await searchParams);
  const serverFilters = withoutCity(filters);
  const queryClient = new QueryClient();

  await Promise.all([
    filters.city
      ? queryClient.query(allCarsQueryOptions(serverFilters)).catch(noop)
      : queryClient
          .infiniteQuery(carsQueryOptions(serverFilters))
          .catch(noop),
    queryClient.query(carFiltersQueryOptions()).catch(noop),
    queryClient.query(carCitiesQueryOptions()).catch(noop),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogClient filters={filters} />
    </HydrationBoundary>
  );
}
