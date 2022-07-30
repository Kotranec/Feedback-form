import React from "react";
import InputMask from "react-input-mask";
import ru from "date-fns/locale/ru";
import DatePicker, { registerLocale } from "react-datepicker";
import { ValidationMessages } from "../forms/FeedbackForm";
import { GetValidationMessage } from "./GetValidationMessage";
import styles from "../forms/FeedbackForm.module.sass";

registerLocale("ru", ru);

interface GetInputFieldType {
  id: string;
  label: string;
  disabled: boolean;
  isValidationDoneIds: string[];
  isValidationDone: boolean;
  validationMessages: ValidationMessages;
  fieldUpdate: (fieldName: string, fieldValue: string | Date) => void;
  addValidation: (inputId: string) => void;
  value?: string | Date;
}

export const GetInputField = ({
  id,
  value,
  label,
  disabled,
  isValidationDoneIds,
  isValidationDone,
  validationMessages,
  fieldUpdate,
  addValidation,
}: GetInputFieldType) => {
  const inputField =
    id === "fullName" || id === "email" ? (
      <input
        id={id}
        formNoValidate
        value={value as string}
        disabled={disabled}
        onChange={(event) => fieldUpdate(event.target.id, event.target.value)}
        onBlur={(event) =>
          !isValidationDoneIds.includes(event.target.id) &&
          event.target.value &&
          addValidation(event.target.id)
        }
      ></input>
    ) : id === "phone" ? (
      <InputMask
        id={id}
        value={value as string}
        mask="+7\(999) 999 99 99"
        disabled={disabled}
        maskPlaceholder="_"
        alwaysShowMask
        onChange={(event) => fieldUpdate(event.target.id, event.target.value)}
        onBlur={(event) =>
          !isValidationDoneIds.includes(event.target.id) &&
          event.target.value !== "+7(___) ___ __ __" &&
          addValidation(event.target.id)
        }
      />
    ) : id === "dateOfBirth" ? (
      <DatePicker
        id={id}
        dateFormat={"dd.MM.yyyyг."}
        selected={value as Date}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        locale="ru"
        className={styles.datepicker}
        disabled={disabled}
        onChange={(date) =>
          fieldUpdate("dateOfBirth", date || new Date(1900, 0, 1))
        }
      />
    ) : id === "message" ? (
      <textarea
        id="message"
        rows={5}
        value={value as string}
        disabled={disabled}
        style={{ resize: "none" }}
        onChange={(event) => fieldUpdate(event.target.id, event.target.value)}
        onBlur={(event) =>
          !isValidationDoneIds.includes(event.target.id) &&
          event.target.value &&
          addValidation(event.target.id)
        }
      ></textarea>
    ) : null;

  return (
    <>
      <div className={styles.label}>{label}</div>
      {inputField}
      <GetValidationMessage
        id={id}
        validationMessages={validationMessages}
        isValidationDoneIds={isValidationDoneIds}
        isValidationDone={isValidationDone}
      />
    </>
  );
};
