"use client";

import Loader from "@/components/Loader/Loader";
import CatalogFilters from "@/components/CatalogFilters/CatalogFilters";
import CarCard from "@/components/CarCard/CarCard";
import { useCars } from "@/hooks/useCars";
import type { CarFilters } from "@/types/car";
import { useState } from "react";
import styles from "./catalog.module.css";

export default function CatalogClient() {
  const [filters, setFilters] = useState<CarFilters>({});
  const { data, isError, isLoading } = useCars(filters);
  const cars = data?.pages.flatMap((page) => page.cars) ?? [];

  return (
    <main className={styles.catalog}>
      <div className="container">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Catalog</p>
          <h1>Choose a rental car</h1>
        </div>

        <CatalogFilters onSubmit={setFilters} />

        {isLoading && <Loader />}

        {isError && (
          <p className={styles.message}>Something went wrong. Try again later.</p>
        )}

        {!isLoading && !isError && cars.length === 0 && (
          <p className={styles.message}>No cars found.</p>
        )}

        {cars.length > 0 && (
          <ul className={styles.list}>
            {cars.map((car, index) => (
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
