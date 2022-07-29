import React, { useState } from "react";
import InputMask from "react-input-mask";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { validateField } from "./Validate";
import styles from "./FeedbackForm.module.sass";

registerLocale("ru", ru);

interface Field {
  [index: string]: any;
}
export interface ValidationMessages extends Field {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  message: string;
}
export interface FieldValues extends Omit<ValidationMessages, "dateOfBirth"> {
  dateOfBirth: Date;
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

export const FeedbackForm = () => {
  const [formValues, setFormValues] = useState<FieldValues>(initFormValuesInit);
  const [validationMessages, setValidationMessages] =
    useState<ValidationMessages>(initValidationMessages);

  const [isValidationDoneIds, setIsValidationDoneIds] = useState<string[]>([]);
  const [isValidationDone, setIsValidationDone] = useState<boolean>(false);

  const [isRequestContinues, setIsRequestContinues] = useState<boolean>(false);
  const [isSubmitFailed, setIsSubmitFailed] = useState<boolean>(false);
  const [isSubmitDone, setIsSubmitDone] = useState<boolean>(false);
  const [serverResponseMessage, setServerResponseMessage] =
    useState<string>("");

  const clearSubmitForm = () => {
    setFormValues(initFormValuesInit);
    setValidationMessages(initValidationMessages);
    setIsValidationDone(false);
    setIsValidationDoneIds([]);
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

  const getValidationMessage = (fieldName: string) => {
    return (
      (isValidationDone ||
        isValidationDoneIds.includes(fieldName) ||
        fieldName === "dateOfBirth") &&
      validationMessages[fieldName] && (
        <div className={styles.validationMessage}>
          {validationMessages[fieldName]}
        </div>
      )
    );
  };

  const validateAndSubmitForm = () => {
    const isValid = !Object.keys(validationMessages).some(
      (item) => validationMessages[item].length
    );
    setIsValidationDone(true);
    isValid && submitForm();
  };

  const submitForm = async () => {
    setIsSubmitFailed(false);
    setIsRequestContinues(true);

    const response = await fetch(
      "http://localhost:8080/api/feedback-form-submit",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formValues),
      }
    );

    const jsonResponse = await response.json();
    setServerResponseMessage(jsonResponse.message);
    setIsRequestContinues(false);

    response.status === 400 && setIsSubmitFailed(true);

    if (response.status === 200) {
      setIsSubmitDone(true);
      clearSubmitForm();
      setTimeout(() => setIsSubmitDone(false), 2000);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.title}>Пожалуйста, заполните все поля</div>

      <div className={styles.row}>
        <div className={styles.label}>Имя Фамилия</div>
        <input
          id="fullName"
          value={formValues.fullName}
          disabled={isRequestContinues}
          onChange={(event) => fieldUpdate(event.target.id, event.target.value)}
          onBlur={(event) =>
            !isValidationDoneIds.includes(event.target.id) &&
            event.target.value &&
            addValidation(event.target.id)
          }
        ></input>
        {getValidationMessage("fullName")}
      </div>

      <div className={styles.row}>
        <div className={styles.label}>E-mail</div>
        <input
          id="email"
          formNoValidate
          value={formValues.email}
          disabled={isRequestContinues}
          onChange={(event) => fieldUpdate(event.target.id, event.target.value)}
          onBlur={(event) =>
            !isValidationDoneIds.includes(event.target.id) &&
            event.target.value &&
            addValidation(event.target.id)
          }
        ></input>
        {getValidationMessage("email")}
      </div>

      <div className={styles.row}>
        <div className={styles.cols}>
          <div className={styles.col}>
            <div className={styles.label}>Номер телефона</div>
            <InputMask
              id="phone"
              mask="+7\(999) 999 99 99"
              value={formValues.phone}
              disabled={isRequestContinues}
              maskPlaceholder="_"
              alwaysShowMask
              onChange={(event) =>
                fieldUpdate(event.target.id, event.target.value)
              }
              onBlur={(event) =>
                !isValidationDoneIds.includes(event.target.id) &&
                event.target.value !== "+7(___) ___ __ __" &&
                addValidation(event.target.id)
              }
            />
            {getValidationMessage("phone")}
          </div>

          <div className={styles.col}>
            <div className={styles.label}>Дата рождения</div>
            <DatePicker
              dateFormat={"dd.MM.yyyyг."}
              selected={formValues.dateOfBirth}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              locale="ru"
              className={styles.datepicker}
              disabled={isRequestContinues}
              onChange={(date) =>
                fieldUpdate("dateOfBirth", date || new Date(1900, 0, 1))
              }
            />
            {getValidationMessage("dateOfBirth")}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Сообщение</div>
        <textarea
          rows={5}
          id="message"
          value={formValues.message}
          disabled={isRequestContinues}
          onChange={(event) => fieldUpdate(event.target.id, event.target.value)}
          onBlur={(event) =>
            !isValidationDoneIds.includes(event.target.id) &&
            event.target.value &&
            addValidation(event.target.id)
          }
        ></textarea>
        {getValidationMessage("message")}
      </div>

      <div className={styles.actionRow}>
        <button
          className={styles.btnSubmit}
          type="submit"
          disabled={isRequestContinues}
          onClick={validateAndSubmitForm}
        >
          Отправить
        </button>
      </div>

      {isSubmitFailed && (
        <div className={styles.serverResponseError}>
          Не удалось отправить форму, попробуйте еще раз (Ошибка:{" "}
          {serverResponseMessage})
        </div>
      )}
      {isSubmitDone && (
        <div className={styles.serverResponseSuccess}>
          {serverResponseMessage}
        </div>
      )}
    </div>
  );
};
