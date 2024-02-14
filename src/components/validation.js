const showInputError = (
  validationConfig,
  popupForm,
  popupInput,
  errorMessage
) => {
  const errorElement = popupForm.querySelector(`.${popupInput.id}-error`);

  popupInput.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.inputErrorActiveClass);
};

const hideInputError = (validationConfig, popupForm, popupInput) => {
  const errorElement = popupForm.querySelector(`.${popupInput.id}-error`);

  popupInput.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.inputErrorActiveClass);
  errorElement.textContent = "";
};

const isValid = (validationConfig, popupForm, popupInput) => {
  // Только латинские и кириллические буквы, знаки дефиса и пробелы
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;

  if (!(popupInput.type === "url")) {
    if (!regex.test(popupInput.value)) {
      popupInput.setCustomValidity(popupInput.dataset.errorMessage);
    } else {
      popupInput.setCustomValidity("");
    }
  }
  if (!popupInput.validity.valid) {
    if (popupInput.validity.valueMissing) {
      showInputError(
        validationConfig,
        popupForm,
        popupInput,
        "Поле не может быть пустым"
      );
    } else {
      showInputError(
        validationConfig,
        popupForm,
        popupInput,
        popupInput.validationMessage
      );
    }
  } else {
    hideInputError(validationConfig, popupForm, popupInput);
  }
};

const setEventListeners = (validationConfig, popupForm) => {
  const inputList = Array.from(
    popupForm.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = popupForm.querySelector(
    validationConfig.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      isValid(validationConfig, popupForm, inputElement);
      toggleButtonState(validationConfig, inputList, buttonElement);
    });
  });
};

const enableValidation = (validationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  formList.forEach((formElement) => {
    setEventListeners(validationConfig, formElement);
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (validationConfig, inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

const clearValidation = (popupForm, validationConfig) => {
  const inputList = Array.from(
    popupForm.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = popupForm.querySelector(
    validationConfig.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity(""); // Сброс кастомного сообщения об ошибке
    hideInputError(validationConfig, popupForm, inputElement); // Очистка стилей ошибки
    inputElement.value = "";
  });

  toggleButtonState(validationConfig, inputList, buttonElement); // Обновление состояния кнопки
};

export { clearValidation, enableValidation };
