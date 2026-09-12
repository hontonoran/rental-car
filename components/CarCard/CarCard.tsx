"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { toggleFavorite, useFavoriteIds } from "@/hooks/useFavorites";
import { formatMileage } from "@/lib/format";
import type { Car } from "@/types/car";
import styles from "./CarCard.module.css";

interface CarCardProps {
  car: Car;
  priority?: boolean;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 34 32" aria-hidden="true" className={styles.heartIcon}>
      {filled ? (
        <path
          className={styles.heartFilled}
          d="M17.066 2.803c9.468-9.732 33.139 7.298 0 29.197-33.139-21.897-9.468-38.929 0-29.197z"
        />
      ) : (
        <path
          className={styles.heartOutline}
          d="M17.066 5.862l-1.53-1.572c-3.59-3.691-10.174-2.417-12.55 2.223-1.116 2.182-1.367 5.333 0.67 9.355 1.963 3.872 6.046 8.51 13.41 13.562 7.364-5.052 11.445-9.69 13.41-13.562 2.037-4.023 1.788-7.172 0.67-9.355-2.377-4.64-8.96-5.916-12.55-2.225l-1.53 1.574zM17.066 32c-32.71-21.615-10.072-38.485-0.375-29.561 0.128 0.118 0.253 0.24 0.375 0.365 0.12-0.126 0.245-0.247 0.375-0.363 9.694-8.93 32.335 7.942-0.375 29.559z"
        />
      )}
    </svg>
  );
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
          <HeartIcon filled={isFavorite} />
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
        Read more
        <span className="visually-hidden">
          {` about ${car.brand} ${car.model}, ${car.year}`}
        </span>
      </Link>
    </article>
  );
}
