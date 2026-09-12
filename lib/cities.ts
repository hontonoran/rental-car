import type { Car } from "@/types/car";

const CITY_ALIASES: Record<string, string> = {
  Kiev: "Kyiv",
  Odessa: "Odesa",
};

export function canonicalCity(city: string) {
  return CITY_ALIASES[city] ?? city;
}

export function getDistinctCities(cars: Car[]) {
  return Array.from(
    new Set(cars.map((car) => canonicalCity(car.location.city))),
  ).sort((a, b) => a.localeCompare(b));
}
