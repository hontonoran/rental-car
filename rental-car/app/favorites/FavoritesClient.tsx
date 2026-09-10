"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import CarCard from "@/components/CarCard/CarCard";
import Loader from "@/components/Loader/Loader";
import { useFavoriteIds } from "@/hooks/useFavorites";
import { getCars } from "@/lib/api";
import type { Car } from "@/types/car";
import styles from "./favorites.module.css";

async function getAllCars(): Promise<Car[]> {
  const firstPage = await getCars(1, {});
  const pageNumbers = Array.from(
    { length: Math.max(firstPage.totalPages - 1, 0) },
    (_, index) => index + 2,
  );
  const restPages = await Promise.all(
    pageNumbers.map((page) => getCars(page, {})),
  );

  return [firstPage, ...restPages].flatMap((page) => page.cars);
}

export default function FavoritesClient() {
  const favoriteIds = useFavoriteIds();
  const {
    data: cars = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["cars", "favorites"],
    queryFn: getAllCars,
    enabled: favoriteIds.length > 0,
  });

  const favoriteCars = favoriteIds
    .map((favoriteId) => cars.find((car) => car.id === favoriteId))
    .filter((car): car is Car => Boolean(car));

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1>Favorite cars</h1>
          <Link href="/catalog" className={styles.link}>
            Back to catalog
          </Link>
        </div>

        {favoriteIds.length === 0 && (
          <div className={styles.empty}>
            <p>You have no favorite cars yet.</p>
            <Link href="/catalog" className={styles.button}>
              Browse cars
            </Link>
          </div>
        )}

        {favoriteIds.length > 0 && isLoading && <Loader />}

        {favoriteIds.length > 0 && isError && (
          <p className={styles.message}>Something went wrong. Try again later.</p>
        )}

        {favoriteIds.length > 0 &&
          !isLoading &&
          !isError &&
          favoriteCars.length === 0 && (
            <div className={styles.empty}>
              <p>Your favorite cars are no longer available.</p>
              <Link href="/catalog" className={styles.button}>
                Browse cars
              </Link>
            </div>
          )}

        {favoriteCars.length > 0 && (
          <ul className={styles.list}>
            {favoriteCars.map((car, index) => (
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
