import React from "react";
import styles from "./index.module.scss";

const loadingRefresh = () => {
  return (
    <div className="flex justify-center h-screen items-center">
      <div className={styles.loader}></div>
    </div>
  );
};

export default loadingRefresh;
