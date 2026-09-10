import Loader from "@/components/Loader/Loader";
import styles from "./page.module.css";

export default function Loading() {
  return (
    <main className={styles.page}>
      <div className="container">
        <Loader />
      </div>
    </main>
  );
}
