"use client";

import { useEffect } from "react";
import styles from "./not-found.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.text}>
          We could not load this page. Please check your connection and try
          again.
        </p>
        <button type="button" className={styles.button} onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
