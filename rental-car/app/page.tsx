import Link from "next/link";
import styles from "./Home.module.css";

export default function HomePage() {
  return (
    <main className={styles.hero}>
      <div className={styles.overlay}>
        <h1>Find your perfect rental car</h1>
        <p>Reliable and budget-friendly rentals for any journey</p>
        <Link href="/catalog" className={styles.button}>
          View Catalog
        </Link>
      </div>
    </main>
  );
}
