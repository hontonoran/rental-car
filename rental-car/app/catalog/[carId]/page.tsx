import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm/BookingForm";
import CarDetails from "@/components/CarDetails/CarDetails";
import { BACKEND_BASE_URL } from "@/lib/backend";
import type { Car } from "@/types/car";

interface CarDetailsPageProps {
  params: Promise<{ carId: string }>;
}

async function fetchCar(carId: string): Promise<Car | null> {
  const response = await fetch(`${BACKEND_BASE_URL}/cars/${carId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function generateMetadata({
  params,
}: CarDetailsPageProps): Promise<Metadata> {
  const { carId } = await params;
  const car = await fetchCar(carId);

  if (!car) {
    return {
      title: "Car not found",
      description: "The requested car could not be found.",
    };
  }

  const title = `${car.brand} ${car.model}`;

  return {
    title,
    description: car.description,
    openGraph: {
      title: `${title} | RentalCar`,
      description: car.description,
      url: `https://rental-car-hontonoran.vercel.app/catalog/${carId}`,
      images: [
        {
          url: car.img,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function CarDetailsPage({
  params,
}: CarDetailsPageProps) {
  const { carId } = await params;
  const car = await fetchCar(carId);

  if (!car) {
    notFound();
  }

  return (
    <main>
      <div className="container">
        <CarDetails car={car}>
          <BookingForm carId={car.id} />
        </CarDetails>
      </div>
    </main>
  );
}
