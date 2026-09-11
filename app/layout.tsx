import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import Header from "@/components/Header/Header";
import QueryProvider from "@/providers/QueryProvider";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RentalCar — rent a car in a few clicks",
    template: "%s | RentalCar",
  },
  description:
    "RentalCar is a car rental service: browse the catalog, filter by brand, price and mileage, and book the car you like.",
  keywords: ["car rental", "rent a car", "RentalCar", "car catalog"],
  authors: [{ name: "Anastasiia Kuzmina" }],
  openGraph: {
    title: "RentalCar — rent a car in a few clicks",
    description:
      "Browse the RentalCar catalog, filter by brand, price and mileage, and book the car you like.",
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentalCar — rent a car in a few clicks",
    description:
      "Browse the RentalCar catalog, filter by brand, price and mileage, and book the car you like.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.variable} data-scroll-behavior="smooth">
      <body>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
