"use client";

import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import CatalogFilters from "@/components/CatalogFilters/CatalogFilters";
import CarCard from "@/components/CarCard/CarCard";
import { useCars } from "@/hooks/useCars";
import { useFavoriteIds } from "@/hooks/useFavorites";
import { getCars } from "@/lib/api";
import type { Car, CarFilters } from "@/types/car";
import { useState } from "react";
import styles from "./catalog.module.css";

async function getAllCars(filters: CarFilters): Promise<Car[]> {
  const firstPage = await getCars(1, filters);
  const pageNumbers = Array.from(
    { length: Math.max(firstPage.totalPages - 1, 0) },
    (_, index) => index + 2,
  );
  const restPages = await Promise.all(
    pageNumbers.map((page) => getCars(page, filters)),
  );

  return [firstPage, ...restPages].flatMap((page) => page.cars);
}

export default function CatalogClient() {
  const [filters, setFilters] = useState<CarFilters>({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const favoriteIds = useFavoriteIds();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = useCars(filters);
  const {
    data: allFilteredCars = [],
    isError: isFavoritesError,
    isLoading: isFavoritesLoading,
  } = useQuery({
    queryKey: ["cars", "favorites-filter", filters],
    queryFn: () => getAllCars(filters),
    enabled: showFavoritesOnly && favoriteIds.length > 0,
  });
  const cars = data?.pages.flatMap((page) => page.cars) ?? [];
  const favoriteCars = showFavoritesOnly
    ? allFilteredCars.filter((car) => favoriteIds.includes(car.id))
    : [];
  const visibleCars = showFavoritesOnly ? favoriteCars : cars;
  const isVisibleLoading = showFavoritesOnly ? isFavoritesLoading : isLoading;
  const isVisibleError = showFavoritesOnly ? isFavoritesError : isError;
  const hasNoFavorites = showFavoritesOnly && favoriteIds.length === 0;
  const hasNoFavoriteMatches =
    showFavoritesOnly &&
    favoriteIds.length > 0 &&
    !isFavoritesLoading &&
    !isFavoritesError &&
    favoriteCars.length === 0;
  const hasNoCatalogResults =
    !showFavoritesOnly && !isLoading && !isError && cars.length === 0;

  const handleFiltersSubmit = (nextFilters: CarFilters) => {
    setFilters(nextFilters);
  };

  return (
    <main className={styles.catalog}>
      <div className="container">
        <CatalogFilters
          favoriteCount={favoriteIds.length}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly((value) => !value)}
          onSubmit={handleFiltersSubmit}
        />

        {isVisibleLoading && <Loader />}

        {isVisibleError && (
          <p className={styles.message}>Something went wrong. Try again later.</p>
        )}

        {hasNoCatalogResults && (
          <p className={styles.message}>No cars found.</p>
        )}

        {hasNoFavorites && (
          <div className={styles.emptyState}>
            <p>No favorite cars yet</p>
            <span>Tap the heart on a car to save it here.</span>
          </div>
        )}

        {hasNoFavoriteMatches && (
          <div className={styles.emptyState}>
            <p>No favorite cars found</p>
            <span>Try changing filters or save more cars.</span>
          </div>
        )}

        {visibleCars.length > 0 && (
          <ul className={styles.list}>
            {visibleCars.map((car, index) => (
              <li key={car.id}>
                <CarCard car={car} priority={index < 4} />
              </li>
            ))}
          </ul>
        )}

        {!showFavoritesOnly && hasNextPage && (
          <button
            type="button"
            className={styles.loadMore}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    </main>
  );
}
