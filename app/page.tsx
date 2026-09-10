import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/hero-car.jpg";
import styles from "./Home.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className={styles.hero}>
      {/* Rendered through next/image so it is served as AVIF/WebP and can be
          preloaded as the LCP element — a CSS background can be neither. */}
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        className={styles.heroImage}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>Find your perfect rental car</h1>
        <p className={styles.subtitle}>
          Reliable and budget-friendly rentals for any journey
        </p>
        <Link href="/catalog" className={styles.button}>
          View Catalog
        </Link>
      </div>
    </main>
  );
}
