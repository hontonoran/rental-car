"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { toggleFavorite, useFavoriteIds } from "@/hooks/useFavorites";
import { formatMileage } from "@/lib/format";
import type { Car } from "@/types/car";
import styles from "./CarCard.module.css";

interface CarCardProps {
  car: Car;
  priority?: boolean;
}

export default function CarCard({ car, priority = false }: CarCardProps) {
  const isFavorite = useFavoriteIds().includes(car.id);

  const details = [
    car.location.city,
    car.location.country,
    car.rentalCompany,
    car.type,
    formatMileage(car.mileage),
  ];

  const handleFavoriteClick = () => {
    const isNowFavorite = toggleFavorite(car.id);

    toast.success(
      isNowFavorite ? "Added to favorites" : "Removed from favorites",
    );
  };

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(max-width: 640px) calc(100vw - 32px), 276px"
          priority={priority}
          className={styles.image}
        />

        <button
          type="button"
          className={styles.favorite}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Remove ${car.brand} ${car.model} from favorites`
              : `Add ${car.brand} ${car.model} to favorites`
          }
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <GoHeartFill aria-hidden="true" />
          ) : (
            <GoHeart aria-hidden="true" />
          )}
        </button>
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>
          <span className={styles.titleText}>
            {car.brand} <span className={styles.model}>{car.model}</span>,{" "}
            {car.year}
          </span>
          <span className={styles.price}>${car.rentalPrice}</span>
        </h2>

        <ul className={styles.details}>
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>

      <Link
        href={`/catalog/${car.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
      >
        {/* The mock-up shows only "Read more"; the hidden suffix makes each
            link distinguishable for screen readers and search engines. */}
        Read more
        <span className="visually-hidden">
          {` about ${car.brand} ${car.model}, ${car.year}`}
        </span>
      </Link>
    </article>
  );
}
