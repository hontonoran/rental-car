import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  noop,
} from "@tanstack/react-query";
import CatalogClient from "./CatalogClient";
import { parseFilters } from "@/lib/filters";
import type { RawSearchParams } from "@/lib/filters";
import { carFiltersQueryOptions, carsQueryOptions } from "@/lib/queries";

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
    siteName: "RentalCar",
    type: "website",
  },
};

interface CatalogPageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = parseFilters(await searchParams);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.infiniteQuery(carsQueryOptions(filters)).catch(noop),
    queryClient.query(carFiltersQueryOptions()).catch(noop),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogClient filters={filters} />
    </HydrationBoundary>
  );
}
