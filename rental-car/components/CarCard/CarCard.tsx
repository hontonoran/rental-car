"use client";

import Image from "next/image";
import Link from "next/link";
import { GoHeart, GoHeartFill } from "react-icons/go";
import toast from "react-hot-toast";
import { toggleFavorite, useFavoriteIds } from "@/hooks/useFavorites";
import type { Car } from "@/types/car";
import styles from "./CarCard.module.css";

interface CarCardProps {
  car: Car;
  priority?: boolean;
}

export default function CarCard({ car, priority = false }: CarCardProps) {
  const favoriteIds = useFavoriteIds();
  const isFavorite = favoriteIds.includes(car.id);

  const handleFavoriteClick = () => {
    const nextValue = toggleFavorite(car.id);

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
