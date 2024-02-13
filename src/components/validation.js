const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "form__input_type_error",
  inputErrorActiveClass: "form__input-error_active",
};

const showInputError = (popupForm, popupInput, errorMessage) => {
  const errorElement = popupForm.querySelector(`.${popupInput.id}-error`);

  popupInput.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.inputErrorActiveClass);
};

const hideInputError = (popupForm, popupInput) => {
  const errorElement = popupForm.querySelector(`.${popupInput.id}-error`);

  popupInput.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.inputErrorActiveClass);
  errorElement.textContent = "";
};

const isValid = (popupForm, popupInput) => {
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
      showInputError(popupForm, popupInput, "Поле не может быть пустым");
    } else {
      showInputError(popupForm, popupInput, popupInput.validationMessage);
    }
  } else {
    hideInputError(popupForm, popupInput);
  }
};

const setEventListeners = (popupForm) => {
  const inputList = Array.from(
    popupForm.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = popupForm.querySelector(
    validationConfig.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      isValid(popupForm, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = (validationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
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
    hideInputError(popupForm, inputElement); // Очистка стилей ошибки
    inputElement.value = "";
  });

  toggleButtonState(inputList, buttonElement); // Обновление состояния кнопки
};

export { clearValidation, enableValidation, validationConfig };
