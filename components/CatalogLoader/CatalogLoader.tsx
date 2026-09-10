import styles from "./CatalogLoader.module.css";

export default function CatalogLoader() {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.title}>Loading cars…</p>
      <p className={styles.text}>
        Please wait while we fetch the best cars for you
      </p>
    </div>
  );
}
