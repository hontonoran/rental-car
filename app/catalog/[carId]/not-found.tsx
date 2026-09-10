import Link from "next/link";
import styles from "@/app/not-found.module.css";

export default function CarNotFound() {
  return (
    <main className={styles.page}>
      <div className={`container ${styles.content}`}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Car not found</h1>
        <p className={styles.text}>
          This car is no longer available. Browse the catalog to find another
          one.
        </p>
        <Link href="/catalog" className={styles.button}>
          Go to catalog
        </Link>
      </div>
    </main>
  );
}
