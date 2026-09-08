"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import toast from "react-hot-toast";
import type { Car } from "@/types/car";
import styles from "./CarCard.module.css";

const FAVORITES_STORAGE_KEY = "rental-car:favorites";
const FAVORITES_CHANGED_EVENT = "rental-car:favorites-changed";

interface CarCardProps {
  car: Car;
  priority?: boolean;
}

function readFavoriteIds() {
  try {
    const value = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : [];

    return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
  } catch {
    return [];
  }
}

function writeFavoriteIds(ids: string[]) {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

function subscribeToFavorites(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  };
}

export default function CarCard({ car, priority = false }: CarCardProps) {
  const isFavorite = useSyncExternalStore(
    subscribeToFavorites,
    () => readFavoriteIds().includes(car.id),
    () => false,
  );

  const handleFavoriteClick = () => {
    const favoriteIds = readFavoriteIds();
    const nextValue = !favoriteIds.includes(car.id);
    const nextFavoriteIds = nextValue
      ? [...favoriteIds, car.id]
      : favoriteIds.filter((id) => id !== car.id);

    writeFavoriteIds(nextFavoriteIds);
    toast.success(nextValue ? "Added to favorites" : "Removed from favorites");
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(max-width: 767px) 100vw, 276px"
          priority={priority}
          className={styles.image}
        />

        <button
          type="button"
          className={styles.favoriteButton}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <GoHeartFill className={styles.favoriteIcon} />
          ) : (
            <GoHeart className={styles.favoriteIcon} />
          )}
        </button>
      </div>

      <div className={styles.titleRow}>
        <h2>
          {car.brand} <span>{car.model}</span>, {car.year}
        </h2>
        <p>${car.rentalPrice}</p>
      </div>

      <p className={styles.meta}>
        {car.location.city} | {car.location.country} | {car.rentalCompany} |{" "}
        {car.type} | {car.mileage.toLocaleString("en-US")} km
      </p>

      <Link
        href={`/catalog/${car.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
      >
        Read more
      </Link>
    </article>
  );
}
