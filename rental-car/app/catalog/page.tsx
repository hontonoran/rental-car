import type { Metadata } from "next";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse available rental cars.",
};

export default function CatalogPage() {
  return <CatalogClient />;
}
