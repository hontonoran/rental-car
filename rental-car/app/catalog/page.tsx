import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse available rental cars.",
  openGraph: {
    title: "Catalog | RentalCar",
    description: "Browse available rental cars.",
    url: "/catalog",
  },
  twitter: {
    title: "Catalog | RentalCar",
    description: "Browse available rental cars.",
  },
};

export default function CatalogPage() {
  return <CatalogClient />;
}
