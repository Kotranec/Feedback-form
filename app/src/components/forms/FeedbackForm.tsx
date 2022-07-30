import React, { useState, useEffect } from "react";
import { submitForm } from "../utils/SubmitForm";
import { validateField } from "../utils/ValidateField";
import { GetInputField } from "../getInput-fields/GetInputField";
import styles from "./FeedbackForm.module.sass";

interface Field {
  [index: string]: any;
}
export interface FieldValues extends Field {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  message: string;
}
export interface ValidationMessages extends Omit<FieldValues, "dateOfBirth"> {
  dateOfBirth: string;
}
export interface SubmitFormStateType {
  isSubmitFailed: boolean;
  isRequestContinues: boolean;
  isSubmitDone: boolean;
  serverResponseMessage: string;
}

const initFormValuesInit: FieldValues = {
  fullName: "",
  email: "",
  phone: "+7(___) ___ __ __",
  dateOfBirth: new Date(1900, 0, 1),
  message: "",
};
const initValidationMessages: ValidationMessages = {
  fullName: "Введите имя и фамилию",
  email: "Введите e-mail",
  phone: "Введите номер телефона",
  dateOfBirth: "",
  message: "Введите сообщение",
};
const initSubmitForm: SubmitFormStateType = {
  isSubmitFailed: false,
  isRequestContinues: false,
  isSubmitDone: false,
  serverResponseMessage: "",
};

export const FeedbackForm = () => {
  const [formValues, setFormValues] = useState<FieldValues>({
    ...initFormValuesInit,
  });
  const [validationMessages, setValidationMessages] =
    useState<ValidationMessages>({ ...initValidationMessages });

  const [isValidationDoneIds, setIsValidationDoneIds] = useState<string[]>([]);
  const [isValidationDone, setIsValidationDone] = useState<boolean>(false);
  const [isValidSubmitForm, setIsValidSubmitForm] = useState<boolean>(false);
  const [submitFormState, setSubmitFormState] = useState<SubmitFormStateType>({
    ...initSubmitForm,
  });

  useEffect(() => {
    const isValid = !Object.keys(validationMessages).some(
      (item) => validationMessages[item].length
    );
    setIsValidSubmitForm(isValid);
  }, [validationMessages]);

  const clearSubmitForm = () => {
    setFormValues({ ...initFormValuesInit });
    setValidationMessages({ ...initValidationMessages });
    setIsValidationDone(false);
    setIsValidationDoneIds([]);
    setIsValidSubmitForm(false);
  };

  const addValidation = (inputId: string) => {
    setIsValidationDoneIds([...isValidationDoneIds, inputId]);
  };

  const fieldUpdate = (fieldName: string, fieldValue: string | Date) =>
    validateField(
      fieldName,
      fieldValue,
      formValues,
      validationMessages,
      setFormValues,
      setValidationMessages
    );

  const validateAndSubmitForm = () => {
    setIsValidationDone(true);
    isValidSubmitForm &&
      submitForm(
        formValues,
        submitFormState,
        setSubmitFormState,
        clearSubmitForm
      );
  };

  const getInputField = (id: string, label: string, value: string | Date) => {
    return (
      <GetInputField
        id={id}
        label={label}
        value={value}
        disabled={submitFormState.isRequestContinues}
        isValidationDoneIds={isValidationDoneIds}
        isValidationDone={isValidationDone}
        validationMessages={validationMessages}
        fieldUpdate={fieldUpdate}
        addValidation={addValidation}
      />
    );
  };

  return (
    <div className={styles.form}>
      <div className={styles.title}>Пожалуйста, заполните все поля</div>

      <div className={styles.row}>
        {getInputField("fullName", "Имя Фамилия", formValues.fullName)}
      </div>
      <div className={styles.row}>
        {getInputField("email", "E-mail", formValues.email)}
      </div>
      <div className={styles.row}>
        <div className={styles.cols}>
          <div className={styles.col}>
            {getInputField("phone", "Номер телефона", formValues.phone)}
          </div>
          <div className={styles.col}>
            {getInputField(
              "dateOfBirth",
              "Дата рождения",
              formValues.dateOfBirth
            )}
          </div>
        </div>
      </div>
      <div className={styles.row}>
        {getInputField("message", "Сообщение", formValues.message)}
      </div>

      <div className={styles.actionRow}>
        <button
          className={styles.btnSubmit}
          type="submit"
          disabled={!isValidSubmitForm || submitFormState.isRequestContinues}
          onClick={validateAndSubmitForm}
        >
          Отправить
        </button>
      </div>
      {submitFormState.isSubmitFailed && (
        <div className={styles.serverResponseError}>
          Не удалось отправить форму, попробуйте еще раз (Ошибка:{" "}
          {submitFormState.serverResponseMessage})
        </div>
      )}
      {submitFormState.isSubmitDone && (
        <div className={styles.serverResponseSuccess}>
          {submitFormState.serverResponseMessage}
        </div>
      )}
    </div>
  );
};
