import type { CarFilters } from "@/types/car";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const FILTER_KEYS = ["brand", "price", "minMileage", "maxMileage"] as const;

function firstValue(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function toDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function parseFilters(searchParams: RawSearchParams): CarFilters {
  return {
    brand: firstValue(searchParams.brand),
    price: toDigits(firstValue(searchParams.price)),
    minMileage: toDigits(firstValue(searchParams.minMileage)),
    maxMileage: toDigits(firstValue(searchParams.maxMileage)),
  };
}

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
