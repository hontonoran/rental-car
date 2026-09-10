"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { GoHeart } from "react-icons/go";
import { getCarFilters } from "@/lib/api";
import type { CarFilters } from "@/types/car";
import styles from "./CatalogFilters.module.css";

interface CatalogFiltersProps {
  onSubmit: (filters: CarFilters) => void;
}

function getPriceOptions(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return [];
  }

  const options: number[] = [];

  for (let price = min; price <= max; price += 10) {
    options.push(price);
  }

  if (options[options.length - 1] !== max) {
    options.push(max);
  }

  return options;
}

function normalizeMileage(value: string) {
  return value.replace(/\D/g, "");
}

export default function CatalogFilters({ onSubmit }: CatalogFiltersProps) {
  const [brand, setBrand] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [minMileage, setMinMileage] = useState("");
  const [maxMileage, setMaxMileage] = useState("");

  const {
    data: filterData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["car-filters"],
    queryFn: getCarFilters,
  });

  const priceOptions = useMemo(
    () => getPriceOptions(filterData?.price.min, filterData?.price.max),
    [filterData?.price.max, filterData?.price.min],
  );

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      brand,
      rentalPrice,
      minMileage,
      maxMileage,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Car brand</span>
        <select
          value={brand}
          disabled={isLoading || isError}
          onChange={(event) => setBrand(event.target.value)}
        >
          <option value="">
            {isLoading
              ? "Loading brands..."
              : isError
                ? "Brands unavailable"
                : "Choose a brand"}
          </option>
          {filterData?.brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Price / 1 hour</span>
        <select
          value={rentalPrice}
          disabled={isLoading || isError}
          onChange={(event) => setRentalPrice(event.target.value)}
        >
          <option value="">Choose a price</option>
          {priceOptions.map((item) => (
            <option key={item} value={item}>
              To ${item}
            </option>
          ))}
        </select>
      </label>

      <fieldset className={styles.mileage}>
        <legend>Car mileage / km</legend>
        <label>
          <span>From</span>
          <input
            type="text"
            inputMode="numeric"
            value={minMileage}
            onChange={(event) =>
              setMinMileage(normalizeMileage(event.target.value))
            }
          />
        </label>
        <label>
          <span>To</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxMileage}
            onChange={(event) =>
              setMaxMileage(normalizeMileage(event.target.value))
            }
          />
        </label>
      </fieldset>

      <button type="submit" disabled={isLoading}>
        Search
      </button>

      <Link
        href="/favorites"
        className={styles.favoritesLink}
        aria-label="Open favorite cars"
        title="Favorite cars"
      >
        <GoHeart aria-hidden="true" />
      </Link>
    </form>
  );
}
