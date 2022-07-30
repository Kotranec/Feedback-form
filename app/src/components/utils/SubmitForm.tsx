import { FieldValues, SubmitFormStateType } from "../forms/FeedbackForm";

export const submitForm = async (
  formValues: FieldValues,
  submitFormState: SubmitFormStateType,
  setSubmitFormState: React.Dispatch<React.SetStateAction<SubmitFormStateType>>,
  clearSubmitForm: () => void
) => {
  let formState = {
    ...submitFormState,
    ...{
      isSubmitFailed: false,
      isRequestContinues: true,
    },
  };
  setSubmitFormState({ ...formState });

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

  formState = {
    ...formState,
    ...{
      isRequestContinues: false,
      serverResponseMessage: jsonResponse.message,
    },
  };
  setSubmitFormState({ ...formState });

  if (response.status === 400) {
    formState = {
      ...formState,
      ...{
        isSubmitFailed: true,
      },
    };
    setSubmitFormState({ ...formState });
  }

  if (response.status === 200) {
    formState = {
      ...formState,
      ...{
        isSubmitDone: true,
      },
    };
    setSubmitFormState({ ...formState });

    clearSubmitForm();

    setTimeout(() => {
      formState = {
        ...formState,
        ...{
          isSubmitDone: false,
        },
      };
      setSubmitFormState({ ...formState });
    }, 2000);
  }
};
