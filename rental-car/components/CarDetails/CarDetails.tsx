import Image from "next/image";
import type { ReactNode } from "react";
import type { Car } from "@/types/car";
import styles from "./CarDetails.module.css";

interface CarDetailsProps {
  car: Car;
  children?: ReactNode;
}

export default function CarDetails({ car, children }: CarDetailsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.leftSide}>
        <div className={styles.imageWrap}>
          <Image
            src={car.img}
            alt={`${car.brand} ${car.model}`}
            fill
            priority
            sizes="(max-width: 1199px) 100vw, 640px"
            className={styles.image}
          />
        </div>
        {children}
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1>
            {car.brand} {car.model}, {car.year}
          </h1>
          <span>Id: {car.id.slice(0, 4)}</span>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg aria-hidden="true" className={styles.icon}>
              <use href="/sprite.svg#icon-location" />
            </svg>
            {car.location.city}, {car.location.country}
          </span>
          <span>Mileage: {car.mileage.toLocaleString("en-US")} km</span>
        </div>

        <p className={styles.price}>${car.rentalPrice}</p>
        <p className={styles.description}>{car.description}</p>

        <section className={styles.block}>
          <h2>Rental Conditions:</h2>
          <ul className={styles.list}>
            {car.rentalConditions.map((condition) => (
              <li key={condition}>
                <svg aria-hidden="true" className={styles.icon}>
                  <use href="/sprite.svg#icon-check-circle" />
                </svg>
                {condition}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block}>
          <h2>Car Specifications:</h2>
          <ul className={styles.list}>
            <li>
              <svg aria-hidden="true" className={styles.icon}>
                <use href="/sprite.svg#icon-calendar" />
              </svg>
              Year: {car.year}
            </li>
            <li>
              <svg aria-hidden="true" className={styles.icon}>
                <use href="/sprite.svg#icon-car" />
              </svg>
              Type: {car.type}
            </li>
            <li>
              <svg aria-hidden="true" className={styles.icon}>
                <use href="/sprite.svg#icon-fuel" />
              </svg>
              Fuel Consumption: {car.fuelConsumption} L/100 km
            </li>
            <li>
              <svg aria-hidden="true" className={styles.icon}>
                <use href="/sprite.svg#icon-gear" />
              </svg>
              Engine Size: {car.engine}
            </li>
          </ul>
        </section>

        <section className={styles.block}>
          <h2>Accessories and functionalities:</h2>
          <ul className={styles.list}>
            {car.features.map((feature) => (
              <li key={feature}>
                <svg aria-hidden="true" className={styles.icon}>
                  <use href="/sprite.svg#icon-check-circle" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
