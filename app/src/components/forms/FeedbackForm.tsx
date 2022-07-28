import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import InputMask from "react-input-mask";
import styles from "./FeedbackForm.module.sass";
import ru from "date-fns/locale/ru";

registerLocale("ru", ru);

export const FeedbackForm = () => {
  const [fullName, setFullName] = useState<string>("");
  const [fullNameValidationMessage, setFullNameValidationMessage] =
    useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [emailValidationMessage, setEmailValidationMessage] =
    useState<string>("");

  const [phone, setPhone] = useState<string>("");
  const [phoneValidationMessage, setPhoneValidationMessage] =
    useState<string>("");

  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(1900, 0, 1));
  const [dateOfBirthValidationMessage, setDateOfBirthValidationMessage] =
    useState<string>("");

  const [message, setMessage] = useState<string>("");
  const [messageValidationMessage, setMessageValidationMessage] =
    useState<string>("");

  const [isValidationDoneIds, setIsValidationDoneIds] = useState<string[]>([]);
  const [isValidationDone, setIsValidationDone] = useState<boolean>(false);

  const [isRequestContinues, setIsRequestContinues] = useState<boolean>(false);
  const [isSubmitFailed, setIsSubmitFailed] = useState<boolean>(false);
  const [isSubmitDone, setIsSubmitDone] = useState<boolean>(false);
  const [serverResponseMessage, setServerResponseMessage] =
    useState<string>("");

  const validateName = (fullName: string): boolean => {
    const upperCasedFullName = fullName.toUpperCase();
    setFullName(upperCasedFullName);

    if (!fullName.length) {
      setFullNameValidationMessage("Введите имя и фамилию");
      return false;
    }

    const validRegex = upperCasedFullName.match(/[A-Z]{3,30}\s[A-Z]{3,30}/);

    const isValid: boolean =
      validRegex != null && validRegex[0].length === upperCasedFullName.length;
    if (!isValid) {
      setFullNameValidationMessage(
        "Имя и фамилия может состоять только из 2-х слов латинского алфавита. Минимальная длина каждого слова 3 символа, максимальная 30. " +
          "Между словами может быть только 1 пробел"
      );
    } else {
      setFullNameValidationMessage("");
    }

    return isValid;
  };

  const focusState = (inputId: string) => {
    setIsValidationDoneIds([...isValidationDoneIds, inputId]);
  };

  const validateEmail = (email: string) => {
    setEmail(email.toLowerCase());

    if (!email.length) {
      setEmailValidationMessage("Введите e-mail");
      return false;
    }

    const isValid = email
      .toLowerCase()
      .match(
        /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
      );

    if (!isValid) {
      setEmailValidationMessage("E-mail должен быть корректным");
    } else {
      setEmailValidationMessage("");
    }

    return isValid != null;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneNamber = phone.replace(/_/g, "");
    setPhone(phoneNamber);

    if (phoneNamber.length <= 7) {
      setPhoneValidationMessage("Введите номер телефона");
      return false;
    }

    const isValid: boolean = phoneNamber.length === 17;
    if (!isValid) {
      setPhoneValidationMessage("Номер телефона должен состоять из 11 цифр");
    } else {
      setPhoneValidationMessage("");
    }

    return isValid;
  };

  const validateDateOfBirth = (dateOfBirth: Date): boolean => {
    setDateOfBirth(dateOfBirth);

    const isValid: boolean =
      dateOfBirth <= new Date() && dateOfBirth >= new Date(1900, 0, 1);
    if (!isValid) {
      setDateOfBirthValidationMessage(
        `Дата рождения должна быть в промежутке с 01.01.1900г. по ${new Date().toLocaleDateString()}г.`
      );
    } else {
      setDateOfBirthValidationMessage("");
    }

    return isValid;
  };

  const validateMessage = (message: string): boolean => {
    setMessage(message);

    if (!message.trim().length) {
      setMessageValidationMessage("Введите сообщение");
      return false;
    }
    const isValid: boolean = message.length >= 10 && message.length <= 300;
    if (!isValid) {
      setMessageValidationMessage(
        "Поле “Сообщение” может иметь минимальную длину в 10 символов и максимальную в 300"
      );
    } else {
      setMessageValidationMessage("");
    }

    return isValid;
  };

  const clearSubmitForm = () => {
    setFullName("");
    setEmail("");
    setPhone("+7(___) ___ __ __");
    setDateOfBirth(new Date(1900, 0, 1));
    setMessage("");
    setIsValidationDone(false);
    // setIsValidationDoneIds([]);
  };

  const validateAndSubmitForm = () => {
    const vName = validateName(fullName);
    const vEmail = validateEmail(email);
    const vPhone = validatePhone(phone);
    const vDateOdBirth = validateDateOfBirth(dateOfBirth);
    const vMessage = validateMessage(message);

    const isValid = vName && vEmail && vPhone && vDateOdBirth && vMessage;

    setIsValidationDone(true);

    if (isValid) submitForm();
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
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          dateOfBirth: dateOfBirth,
          message: message,
        }),
      }
    );

    const jsonResponse = await response.json();
    setServerResponseMessage(jsonResponse.message);
    setIsRequestContinues(false);

    if (response.status === 400) {
      setIsSubmitFailed(true);
    }
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
          id="name"
          value={fullName}
          disabled={isRequestContinues}
          onChange={(event) => validateName(event.target.value)}
          onBlur={(event) =>
            !isValidationDoneIds.includes(event.target.id) &&
            event.target.value &&
            focusState(event.target.id)
          }
        ></input>
        {(isValidationDone || isValidationDoneIds.includes("name")) &&
          fullNameValidationMessage && (
            <div className={styles.validationMessage}>
              {fullNameValidationMessage}
            </div>
          )}
      </div>

      <div className={styles.row}>
        <div className={styles.label}>E-mail</div>
        <input
          id="email"
          formNoValidate
          value={email}
          disabled={isRequestContinues}
          onChange={(event) => validateEmail(event.target.value)}
          onBlur={(event) =>
            !isValidationDoneIds.includes(event.target.id) &&
            event.target.value &&
            focusState(event.target.id)
          }
        ></input>
        {(isValidationDone || isValidationDoneIds.includes("email")) &&
          emailValidationMessage && (
            <div className={styles.validationMessage}>
              {emailValidationMessage}
            </div>
          )}
      </div>

      <div className={styles.row}>
        <div className={styles.cols}>
          <div className={styles.col}>
            <div className={styles.label}>Номер телефона</div>
            <InputMask
              id="phone"
              mask="+7\(999) 999 99 99"
              value={phone}
              disabled={isRequestContinues}
              maskPlaceholder="_"
              alwaysShowMask
              onChange={(event) => validatePhone(event.target.value)}
              onBlur={(event) =>
                !isValidationDoneIds.includes(event.target.id) &&
                event.target.value !== "+7(___) ___ __ __" &&
                focusState(event.target.id)
              }
            />
            {(isValidationDone || isValidationDoneIds.includes("phone")) &&
              phoneValidationMessage && (
                <div className={styles.validationMessage}>
                  {phoneValidationMessage}
                </div>
              )}
          </div>

          <div className={styles.col}>
            <div className={styles.label}>Дата рождения</div>
            <DatePicker
              dateFormat={"dd.MM.yyyyг."}
              selected={dateOfBirth}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              locale="ru"
              className={styles.datepicker}
              disabled={isRequestContinues}
              onChange={validateDateOfBirth}
            />
            {dateOfBirthValidationMessage && (
              <div className={styles.validationMessage}>
                {dateOfBirthValidationMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.label}>Сообщение</div>
        <textarea
          rows={5}
          id="message"
          value={message}
          disabled={isRequestContinues}
          onChange={(event) => validateMessage(event.target.value)}
          onBlur={(event) =>
            !isValidationDoneIds.includes(event.target.id) &&
            event.target.value &&
            focusState(event.target.id)
          }
        ></textarea>
        {(isValidationDone || isValidationDoneIds.includes("message")) &&
          messageValidationMessage && (
            <div className={styles.validationMessage}>
              {messageValidationMessage}
            </div>
          )}
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
