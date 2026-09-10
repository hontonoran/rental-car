import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import "modern-normalize/modern-normalize.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import Header from "@/components/Header/Header";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://rental-car-hontonoran.vercel.app"),
  title: {
    default: "RentalCar",
    template: "%s | RentalCar",
  },
  description:
    "RentalCar is a web application for browsing, filtering and renting cars.",
  openGraph: {
    title: "RentalCar",
    description:
      "RentalCar is a web application for browsing, filtering and renting cars.",
    url: "/",
    siteName: "RentalCar",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RentalCar",
    description:
      "RentalCar is a web application for browsing, filtering and renting cars.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
