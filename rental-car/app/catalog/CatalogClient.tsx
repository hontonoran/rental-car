"use client";

import Loader from "@/components/Loader/Loader";
import { useCars } from "@/hooks/useCars";
import styles from "./catalog.module.css";

export default function CatalogClient() {
  const { data, isError, isLoading } = useCars({});
  const cars = data?.pages.flatMap((page) => page.cars) ?? [];

  return (
    <main className={styles.catalog}>
      <div className="container">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Catalog</p>
          <h1>Choose a rental car</h1>
        </div>

        {isLoading && <Loader />}

        {isError && (
          <p className={styles.message}>Something went wrong. Try again later.</p>
        )}

        {!isLoading && !isError && cars.length === 0 && (
          <p className={styles.message}>No cars found.</p>
        )}

        {cars.length > 0 && (
          <ul className={styles.list}>
            {cars.map((car) => (
              <li className={styles.item} key={car.id}>
                <div>
                  <h2>
                    {car.brand} {car.model}, {car.year}
                  </h2>
                  <p>
                    {car.location.city} | {car.location.country} | {car.type}
                  </p>
                </div>
                <strong>${car.rentalPrice}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
