import { ValidationMessages, FieldValues } from "../forms/FeedbackForm";

const setValidateFormValues = <T extends FieldValues | ValidationMessages>(
  fieldValues: T,
  fieldName: string,
  fieldValue: string | Date,
  setFieldValues: React.Dispatch<React.SetStateAction<T>>
) => {
  setFieldValues({
    ...fieldValues,
    ...{
      [fieldName]: fieldValue,
    },
  });
};

export const validateField = <T extends string | Date>(
  fieldName: string,
  fieldValue: T,
  formValues: FieldValues,
  validationMessages: ValidationMessages,
  setFormValues: React.Dispatch<React.SetStateAction<FieldValues>>,
  setValidationMessage: React.Dispatch<React.SetStateAction<ValidationMessages>>
) => {
  switch (fieldName) {
    case "fullName": {
      const value = fieldValue as string;
      const upperCasedFullName = value.toUpperCase();
      setValidateFormValues(
        formValues,
        fieldName,
        upperCasedFullName,
        setFormValues
      );
      if (!value.length) {
        setValidateFormValues(
          validationMessages,
          fieldName,
          "Введите имя и фамилию",
          setValidationMessage
        );
        break;
      }

      const validRegex = upperCasedFullName.match(/[A-Z]{3,30}\s[A-Z]{3,30}/);

      const isValid: boolean =
        validRegex != null &&
        validRegex[0].length === upperCasedFullName.length;

      const message =
        "Имя и фамилия может состоять только из 2-х слов латинского алфавита. Минимальная длина каждого слова 3 символа, максимальная 30. " +
        "Между словами может быть только 1 пробел";
      setValidateFormValues(
        validationMessages,
        fieldName,
        isValid ? "" : message,
        setValidationMessage
      );
      break;
    }

    case "email": {
      setValidateFormValues(formValues, fieldName, fieldValue, setFormValues);
      const value = fieldValue as string;

      if (!value.length) {
        setValidateFormValues(
          validationMessages,
          fieldName,
          "Введите e-mail",
          setValidationMessage
        );
        break;
      }

      const isValid = value
        .toLowerCase()
        .match(
          /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
        );

      const message = "E-mail должен быть корректным";
      setValidateFormValues(
        validationMessages,
        fieldName,
        isValid ? "" : message,
        setValidationMessage
      );
      break;
    }

    case "phone": {
      const value = fieldValue as string;
      const phoneNamber = value.replace(/_/g, "");
      setValidateFormValues(formValues, fieldName, phoneNamber, setFormValues);

      if (phoneNamber.length <= 7) {
        setValidateFormValues(
          validationMessages,
          fieldName,
          "Введите номер телефона",
          setValidationMessage
        );
        break;
      }

      const isValid: boolean = phoneNamber.length === 17;
      const message = "Номер телефона должен состоять из 11 цифр";
      setValidateFormValues(
        validationMessages,
        fieldName,
        isValid ? "" : message,
        setValidationMessage
      );
      break;
    }

    case "dateOfBirth": {
      const val = fieldValue as Date;
      setValidateFormValues(formValues, fieldName, fieldValue, setFormValues);

      const isValid: boolean = val <= new Date() && val >= new Date(1900, 0, 1);

      const message = `Дата рождения должна быть в промежутке с 01.01.1900г. по ${new Date().toLocaleDateString()}г.`;
      setValidateFormValues(
        validationMessages,
        fieldName,
        isValid ? "" : message,
        setValidationMessage
      );
      break;
    }

    case "message": {
      const val = fieldValue as string;
      setValidateFormValues(formValues, fieldName, fieldValue, setFormValues);

      if (!val.trim().length) {
        setValidateFormValues(
          validationMessages,
          fieldName,
          "Введите сообщение",
          setValidationMessage
        );
        break;
      }
      const isValid: boolean = val.length >= 10 && val.length <= 300;

      const message =
        "Поле “Сообщение” может иметь минимальную длину в 10 символов и максимальную в 300";
      setValidateFormValues(
        validationMessages,
        fieldName,
        isValid ? "" : message,
        setValidationMessage
      );
      break;
    }
  }
};
