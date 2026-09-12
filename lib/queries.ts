import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchAllCars, getCarFilters, getCars } from "@/lib/api";
import { getDistinctCities } from "@/lib/cities";
import type { CarFilters, CarsResponse } from "@/types/car";

export function carsQueryOptions(filters: CarFilters) {
  return infiniteQueryOptions({
    queryKey: ["cars", filters] as const,
    queryFn: ({ pageParam, signal }) => getCars(pageParam, filters, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CarsResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function allCarsQueryOptions(filters: CarFilters) {
  return queryOptions({
    queryKey: ["cars", "all", filters] as const,
    queryFn: ({ signal }) => fetchAllCars(filters, signal),
  });
}

export function carFiltersQueryOptions() {
  return queryOptions({
    queryKey: ["car-filters"] as const,
    queryFn: ({ signal }) => getCarFilters(signal),
    staleTime: Infinity,
  });
}

export function carCitiesQueryOptions() {
  return queryOptions({
    queryKey: ["car-cities"] as const,
    queryFn: async ({ signal }) => {
      const cars = await fetchAllCars({}, signal);

      return getDistinctCities(cars);
    },
    staleTime: Infinity,
  });
}
