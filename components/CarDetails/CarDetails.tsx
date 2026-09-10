import {
  LuCalendar,
  LuCar,
  LuCircleCheck,
  LuFuel,
  LuGauge,
  LuMapPin,
  LuSettings,
} from "react-icons/lu";
import type { Car } from "@/types/car";
import styles from "./CarDetails.module.css";

interface CarDetailsProps {
  car: Car;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const specifications = [
    { Icon: LuCalendar, text: `Year: ${car.year}` },
    { Icon: LuCar, text: `Type: ${car.type}` },
    { Icon: LuFuel, text: `Fuel Consumption: ${car.fuelConsumption}` },
    { Icon: LuSettings, text: `Engine: ${car.engine}` },
    { Icon: LuGauge, text: `Mileage: ${car.mileage} km` },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            {car.brand} {car.model}, {car.year}
          </h1>
          {car.stockNumber !== undefined && (
            <p className={styles.article}>Article: {car.stockNumber}</p>
          )}
        </div>

        <p className={styles.location}>
          <LuMapPin aria-hidden="true" className={styles.icon} />
          {car.location.city}, {car.location.country}
        </p>

        <p className={styles.price}>${car.rentalPrice}</p>
      </div>

      <p className={styles.description}>{car.description}</p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Rental Conditions:</h2>
        <ul className={styles.list}>
          {car.rentalConditions.map((condition) => (
            <li key={condition}>
              <LuCircleCheck aria-hidden="true" className={styles.icon} />
              {condition}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Car Specifications:</h2>
        <ul className={styles.list}>
          {specifications.map(({ Icon, text }) => (
            <li key={text}>
              <Icon aria-hidden="true" className={styles.icon} />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Features:</h2>
        <ul className={styles.list}>
          {car.features.map((feature) => (
            <li key={feature}>
              <LuCircleCheck aria-hidden="true" className={styles.icon} />
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
