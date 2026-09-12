"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "@/components/Select/Select";
import type { SelectOption } from "@/components/Select/Select";
import { carCitiesQueryOptions, carFiltersQueryOptions } from "@/lib/queries";
import { toDigits } from "@/lib/filters";
import type { CarFilters } from "@/types/car";
import styles from "./CatalogFilters.module.css";

interface CatalogFiltersProps {
  filters: CarFilters;
  onSubmit: (filters: CarFilters) => void;
  onClear: () => void;
}

const PRICE_STEP = 10;

function buildPriceOptions(min?: number, max?: number): SelectOption[] {
  if (min === undefined || max === undefined) {
    return [];
  }

  const options: SelectOption[] = [];

  for (let price = min; price <= max; price += PRICE_STEP) {
    options.push({
      value: String(price),
      label: String(price),
      displayLabel: `To $${price}`,
    });
  }

  return options;
}

export default function CatalogFilters({
  filters,
  onSubmit,
  onClear,
}: CatalogFiltersProps) {
  const [brand, setBrand] = useState(filters.brand ?? "");
  const [price, setPrice] = useState(filters.price ?? "");
  const [minMileage, setMinMileage] = useState(filters.minMileage ?? "");
  const [maxMileage, setMaxMileage] = useState(filters.maxMileage ?? "");
  const [city, setCity] = useState(filters.city ?? "");

  const { data, isPending, isError } = useQuery(carFiltersQueryOptions());
  const {
    data: cities,
    isPending: isCitiesPending,
    isError: isCitiesError,
  } = useQuery(carCitiesQueryOptions());

  const brandOptions = useMemo<SelectOption[]>(
    () => data?.brands.map((item) => ({ value: item, label: item })) ?? [],
    [data?.brands],
  );

  const priceOptions = useMemo(
    () => buildPriceOptions(data?.price.min, data?.price.max),
    [data?.price.min, data?.price.max],
  );

  const cityOptions = useMemo<SelectOption[]>(
    () => cities?.map((item) => ({ value: item, label: item })) ?? [],
    [cities],
  );

  const isOptionsUnavailable = isPending || isError;
  const isCityUnavailable = isCitiesPending || isCitiesError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ brand, price, minMileage, maxMileage, city });
  };

  const handleClear = () => {
    setBrand("");
    setPrice("");
    setMinMileage("");
    setMaxMileage("");
    setCity("");
    onClear();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.fields}>
          <Select
            className={styles.brand}
            label="Car brand"
            placeholder={isError ? "Brands unavailable" : "Choose a brand"}
            value={brand}
            options={brandOptions}
            disabled={isOptionsUnavailable}
            onChange={setBrand}
          />

          <Select
            className={styles.price}
            label="Price/ 1 hour"
            placeholder={isError ? "Prices unavailable" : "Choose a price"}
            value={price}
            options={priceOptions}
            disabled={isOptionsUnavailable}
            onChange={setPrice}
          />

          <fieldset className={styles.mileage}>
            <legend className={styles.legend}>Car mileage / km</legend>
            <div className={styles.mileageInputs}>
              <input
                className={`${styles.input} ${styles.inputFrom}`}
                type="text"
                inputMode="numeric"
                placeholder="From"
                aria-label="Minimum mileage"
                value={minMileage}
                onChange={(event) => setMinMileage(toDigits(event.target.value))}
              />

              <input
                className={`${styles.input} ${styles.inputTo}`}
                type="text"
                inputMode="numeric"
                placeholder="To"
                aria-label="Maximum mileage"
                value={maxMileage}
                onChange={(event) => setMaxMileage(toDigits(event.target.value))}
              />
            </div>
          </fieldset>

          <Select
            className={styles.city}
            label="City"
            placeholder={isCitiesError ? "Cities unavailable" : "Choose a city"}
            value={city}
            options={cityOptions}
            disabled={isCityUnavailable}
            onChange={setCity}
          />
        </div>

        <button type="submit" className={styles.search}>
          Search
        </button>
      </div>

      <button type="button" className={styles.clear} onClick={handleClear}>
        Clear filters
      </button>
    </form>
  );
}
