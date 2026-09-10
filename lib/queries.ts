import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getCarFilters, getCars } from "@/lib/api";
import type { CarFilters, CarsResponse } from "@/types/car";

/**
 * Shared query definitions so the server component prefetches exactly the same
 * cache entries the client component subscribes to.
 */
export function carsQueryOptions(filters: CarFilters) {
  return infiniteQueryOptions({
    queryKey: ["cars", filters] as const,
    queryFn: ({ pageParam, signal }) => getCars(pageParam, filters, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CarsResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function carFiltersQueryOptions() {
  return queryOptions({
    queryKey: ["car-filters"] as const,
    queryFn: ({ signal }) => getCarFilters(signal),
    staleTime: Infinity,
  });
}
