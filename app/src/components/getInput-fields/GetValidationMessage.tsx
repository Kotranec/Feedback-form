import React from "react";
import { ValidationMessages } from "../forms/FeedbackForm";
import styles from "../forms/FeedbackForm.module.sass";

interface GetValidationMessageType {
  id: string;
  validationMessages: ValidationMessages;
  isValidationDoneIds: string[];
  isValidationDone: boolean;
}

export const GetValidationMessage = ({
  id,
  validationMessages,
  isValidationDone,
  isValidationDoneIds,
}: GetValidationMessageType) => {
  return (
    (isValidationDone ||
      isValidationDoneIds.includes(id) ||
      id === "dateOfBirth") &&
    validationMessages[id] && (
      <div className={styles.validationMessage}>{validationMessages[id]}</div>
    )
  );
};
