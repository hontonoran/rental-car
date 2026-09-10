import type { Metadata } from "next";
import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = {
  title: "Favorites",
  description: "View your favorite rental cars.",
  openGraph: {
    title: "Favorites | RentalCar",
    description: "View your favorite rental cars.",
    url: "/favorites",
  },
  twitter: {
    title: "Favorites | RentalCar",
    description: "View your favorite rental cars.",
  },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
