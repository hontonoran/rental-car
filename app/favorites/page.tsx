import type { Metadata } from "next";
import FavoritesClient from "./FavoritesClient";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Favorites",
  description: "The cars you saved while browsing the RentalCar catalog.",
  alternates: { canonical: "/favorites" },
  robots: { index: false },
  openGraph: {
    title: "Favorites | RentalCar",
    description: "The cars you saved while browsing the RentalCar catalog.",
    url: "/favorites",
    siteName: SITE_NAME,
    type: "website",
    images: [OG_IMAGE],
  },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
