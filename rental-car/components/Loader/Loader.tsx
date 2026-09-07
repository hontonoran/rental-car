import { Triangle } from "react-loader-spinner";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <Triangle
      visible
      height="80"
      width="80"
      color="#3470ff"
      ariaLabel="triangle-loading"
      wrapperClass={styles.wrapper}
    />
  );
}
