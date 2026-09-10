"use client";

import { useQuery } from "@tanstack/react-query";
import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { getCarFilters } from "@/lib/api";
import type { CarFilters } from "@/types/car";
import styles from "./CatalogFilters.module.css";

interface CatalogFiltersProps {
  favoriteCount: number;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
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

export default function CatalogFilters({
  favoriteCount,
  showFavoritesOnly,
  onSubmit,
  onToggleFavorites,
}: CatalogFiltersProps) {
  const [brand, setBrand] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [minMileage, setMinMileage] = useState("");
  const [maxMileage, setMaxMileage] = useState("");
  const shouldShowFavoritesControl = favoriteCount > 0 || showFavoritesOnly;

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

      <div className={styles.actions}>
        {shouldShowFavoritesControl && (
          <button
            type="button"
            className={
              showFavoritesOnly
                ? `${styles.favoriteToggle} ${styles.favoriteToggleActive}`
                : styles.favoriteToggle
            }
            aria-label={
              showFavoritesOnly
                ? `Show all cars. ${favoriteCount} favorite cars saved.`
                : `Show favorite cars. ${favoriteCount} favorite cars saved.`
            }
            aria-pressed={showFavoritesOnly}
            title="Favorite cars"
            onClick={onToggleFavorites}
          >
            {showFavoritesOnly ? (
              <GoHeartFill aria-hidden="true" />
            ) : (
              <GoHeart aria-hidden="true" />
            )}
          </button>
        )}

        <button
          type="submit"
          className={styles.searchButton}
          disabled={isLoading}
        >
          Search
        </button>
      </div>
    </form>
  );
}
