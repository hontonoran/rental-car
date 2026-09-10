"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isCatalogActive = pathname.startsWith("/catalog");

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          Rental<span>Car</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link
            href="/"
            className={!isCatalogActive ? styles.active : undefined}
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className={isCatalogActive ? styles.active : undefined}
          >
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
