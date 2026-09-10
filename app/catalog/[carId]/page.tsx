import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import BookingForm from "@/components/BookingForm/BookingForm";
import CarDetails from "@/components/CarDetails/CarDetails";
import { getCarById } from "@/lib/api";
import type { Car } from "@/types/car";
import styles from "./page.module.css";

interface CarPageProps {
  params: Promise<{ carId: string }>;
}

async function fetchCar(carId: string): Promise<Car | null> {
  try {
    return await getCarById(carId);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function generateMetadata({
  params,
}: CarPageProps): Promise<Metadata> {
  const { carId } = await params;
  const car = await fetchCar(carId);

  if (!car) {
    return {
      title: "Car not found",
      description: "The car you are looking for is no longer available.",
    };
  }

  const title = `${car.brand} ${car.model}, ${car.year}`;

  return {
    title,
    description: car.description,
    alternates: { canonical: `/catalog/${carId}` },
    openGraph: {
      title: `${title} | RentalCar`,
      description: car.description,
      url: `/catalog/${carId}`,
      siteName: "RentalCar",
      type: "website",
      images: [{ url: car.img, width: 640, height: 512, alt: title }],
    },
  };
}

export default async function CarPage({ params }: CarPageProps) {
  const { carId } = await params;
  const car = await fetchCar(carId);

  if (!car) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.left}>
            <div className={styles.media}>
              <Image
                src={car.img}
                alt={`${car.brand} ${car.model}`}
                fill
                priority
                sizes="(max-width: 1199px) 100vw, 640px"
                className={styles.image}
              />
            </div>

            <BookingForm carId={car.id} />
          </div>

          <CarDetails car={car} />
        </div>
      </div>
    </main>
  );
}
