import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.content}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.text}>
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Link href="/" className={styles.button}>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
