"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import CarCard from "@/components/CarCard/CarCard";
import CatalogFilters from "@/components/CatalogFilters/CatalogFilters";
import CatalogLoader from "@/components/CatalogLoader/CatalogLoader";
import { buildFiltersQuery } from "@/lib/filters";
import { carsQueryOptions } from "@/lib/queries";
import type { CarFilters } from "@/types/car";
import styles from "./catalog.module.css";
import notFoundImage from "@/public/no-cars-found.png";

interface CatalogClientProps {
  filters: CarFilters;
}

const SKELETON_CARDS = Array.from({ length: 12 }, (_, index) => index);

export default function CatalogClient({ filters }: CatalogClientProps) {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery(carsQueryOptions(filters));

  const cars = data?.pages.flatMap((page) => page.cars) ?? [];
  const isLoading = isPending || isNavigating;
  const isEmpty = !isLoading && !error && cars.length === 0;

  const applyFilters = (nextFilters: CarFilters) => {
    const query = buildFiltersQuery(nextFilters);

    startTransition(() => {
      router.push(query ? `/catalog?${query}` : "/catalog", { scroll: false });
    });
  };

  return (
    <main className={styles.catalog}>
      <div className="container">
        <h1 className="visually-hidden">Car catalog</h1>
        <CatalogFilters
          key={buildFiltersQuery(filters)}
          filters={filters}
          onSubmit={applyFilters}
          onClear={() => applyFilters({})}
        />
        {error && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>We could not load the cars</p>
            <p className={styles.stateText}>
              Something went wrong on our side. Please try again.
            </p>

            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        )}

        {isEmpty && (
          <div className={styles.state}>
            <Image
              src={notFoundImage}
              alt=""
              className={styles.stateImage}
              priority
            />

            <p className={styles.stateTitle}>No cars found</p>
            <p className={styles.stateText}>
              We couldn&apos;t find any cars that match your current filters.
              Try changing your search criteria or reset the filters.
            </p>

            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => applyFilters({})}
            >
              Reset filters
            </button>
          </div>
        )}

        {(cars.length > 0 || isLoading) && (
          <div className={isLoading ? styles.loadingArea : undefined}>
            {cars.length > 0 ? (
              <ul className={styles.list}>
                {cars.map((car, index) => (
                  <li key={car.id}>
                    <CarCard car={car} priority={index < 4} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.list} aria-hidden="true">
                {SKELETON_CARDS.map((index) => (
                  <li key={index}>
                    <div className={styles.skeleton}>
                      <div className={styles.skeletonImage} />
                      <div className={styles.skeletonLine} />
                      <div className={styles.skeletonBox} />
                      <div className={styles.skeletonButton} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {isLoading && <CatalogLoader />}
          </div>
        )}

        {hasNextPage && !isLoading && (
          <button
            type="button"
            className={styles.loadMore}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </main>
  );
}
