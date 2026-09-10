"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import CarCard from "@/components/CarCard/CarCard";
import Loader from "@/components/Loader/Loader";
import { useFavoriteIds } from "@/hooks/useFavorites";
import { getCarById } from "@/lib/api";
import type { Car } from "@/types/car";
import styles from "./favorites.module.css";

export default function FavoritesClient() {
  const favoriteIds = useFavoriteIds();

  const { data: cars, isPending, isError } = useQuery({
    queryKey: ["favorite-cars", favoriteIds],
    queryFn: async ({ signal }) => {
      const results = await Promise.allSettled(
        favoriteIds.map((id) => getCarById(id, signal)),
      );

      return results
        .filter(
          (result): result is PromiseFulfilledResult<Car> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);
    },
    enabled: favoriteIds.length > 0,
  });

  const isEmpty = favoriteIds.length === 0;
  const isLoading = !isEmpty && isPending;
  const hasCars = Boolean(cars && cars.length > 0);

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Favorite cars</h1>
        {isEmpty && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>No favorite cars yet</p>
            <p className={styles.stateText}>
              Tap the heart on a car card and it will be saved here.
            </p>

            <Link href="/catalog" className={styles.button}>
              Go to catalog
            </Link>
          </div>
        )}

        {isLoading && <Loader />}

        {!isEmpty && isError && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>We could not load your cars</p>
            <p className={styles.stateText}>
              Something went wrong on our side. Please try again later.
            </p>
          </div>
        )}

        {!isEmpty && !isPending && !isError && !hasCars && (
          <div className={styles.state}>
            <p className={styles.stateTitle}>
              Your saved cars are no longer available
            </p>

            <Link href="/catalog" className={styles.button}>
              Go to catalog
            </Link>
          </div>
        )}

        {hasCars && (
          <ul className={styles.list}>
            {cars!.map((car, index) => (
              <li key={car.id}>
                <CarCard car={car} priority={index < 4} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
