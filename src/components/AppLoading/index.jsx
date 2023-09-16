import React from "react";
import styles from "./index.module.css";

const AppLoading = () => {
  return (
    <div className="flex justify-center h-screen items-center">
      <div className={styles.loader}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
};

export default AppLoading;
