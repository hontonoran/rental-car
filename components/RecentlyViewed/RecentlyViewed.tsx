"use client";

import { useQuery } from "@tanstack/react-query";
import CarCard from "@/components/CarCard/CarCard";
import Loader from "@/components/Loader/Loader";
import { useRecentlyViewedIds } from "@/hooks/useRecentlyViewed";
import { getCarById } from "@/lib/api";
import type { Car } from "@/types/car";
import styles from "./RecentlyViewed.module.css";

export default function RecentlyViewed() {
  const recentlyViewedIds = useRecentlyViewedIds();

  const { data: cars, isPending } = useQuery({
    queryKey: ["recently-viewed-cars", recentlyViewedIds],
    queryFn: async ({ signal }) => {
      const results = await Promise.allSettled(
        recentlyViewedIds.map((id) => getCarById(id, signal)),
      );

      return results
        .filter(
          (result): result is PromiseFulfilledResult<Car> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);
    },
    enabled: recentlyViewedIds.length > 0,
  });

  const isLoading = recentlyViewedIds.length > 0 && isPending;

  if (recentlyViewedIds.length === 0) {
    return null;
  }

  if (!isLoading && (!cars || cars.length === 0)) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>Recently viewed</h2>

        {isLoading ? (
          <Loader />
        ) : (
          <ul className={styles.list}>
            {cars!.map((car) => (
              <li key={car.id}>
                <CarCard car={car} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
