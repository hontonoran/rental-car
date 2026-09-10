import styles from "./Loader.module.css";

/** Compact spinner for route-level and in-page loading states. */
export default function Loader() {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}
