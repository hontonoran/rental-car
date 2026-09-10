import type { CarFilters } from "@/types/car";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const FILTER_KEYS = ["brand", "price", "minMileage", "maxMileage"] as const;

function firstValue(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

/** Keep only digits — the API rejects anything else in numeric filters. */
export function toDigits(value: string) {
  return value.replace(/\D/g, "");
}

/** Read a filter set out of the `/catalog` search params. */
export function parseFilters(searchParams: RawSearchParams): CarFilters {
  return {
    brand: firstValue(searchParams.brand),
    price: toDigits(firstValue(searchParams.price)),
    minMileage: toDigits(firstValue(searchParams.minMileage)),
    maxMileage: toDigits(firstValue(searchParams.maxMileage)),
  };
}

/** Serialise a filter set back into a query string, dropping empty values. */
export function buildFiltersQuery(filters: CarFilters) {
  const params = new URLSearchParams();

  FILTER_KEYS.forEach((key) => {
    const value = filters[key];

    if (value) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export function hasActiveFilters(filters: CarFilters) {
  return FILTER_KEYS.some((key) => Boolean(filters[key]));
}
