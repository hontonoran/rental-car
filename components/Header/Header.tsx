"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo/Logo";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useFavoriteIds } from "@/hooks/useFavorites";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const favoriteCount = useFavoriteIds().length;

  const isActive = (href: string) => pathname === href;

  const showFavorites = favoriteCount > 0 || isActive("/favorites");

  const links = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    ...(showFavorites ? [{ href: "/favorites", label: "Favorites" }] : []),
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="RentalCar — home">
          <Logo />
        </Link>

        <div className={styles.right}>
          <nav className={styles.nav} aria-label="Main navigation">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={isActive(href) ? styles.active : undefined}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
                {href === "/favorites" && favoriteCount > 0 && (
                  <span className={styles.badge}>{favoriteCount}</span>
                )}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
