import { FeedbackForm } from "../components/forms/FeedbackForm";
import React from "react";
import styles from "./FeedbackPage.module.sass";

export const FeedbackPage = () => {
  return (
    <div className={styles.page}>
      <FeedbackForm />
    </div>
  );
};
