import { FeedbackPage } from "./pages/FeedbackPage";
import React from "react";
import { createRoot } from "react-dom/client";
import styles from "./index.modules.sass";

const App = () => {
  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Форма обратной связи</h1>

      <FeedbackPage />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
