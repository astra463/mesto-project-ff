export {clearValidation, enableValidation};

const showInputError = (popupForm, popupInput, errorMessage) => {
  const errorElement = popupForm.querySelector(`.${popupInput.id}-error`);

  popupInput.classList.add("form__input_type_error");
  errorElement.textContent = errorMessage;
  errorElement.classList.add("form__input-error_active");
};

const hideInputError = (popupForm, popupInput) => {
  const errorElement = popupForm.querySelector(`.${popupInput.id}-error`);

  popupInput.classList.remove("form__input_type_error");
  errorElement.classList.remove("form__input-error_active");
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
  const inputList = Array.from(popupForm.querySelectorAll(".popup__input"));
  const buttonElement = popupForm.querySelector(".popup__button");

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
    buttonElement.classList.add("popup__button_inactive");
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("popup__button_inactive");
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
    inputElement.value = '';
  });

  toggleButtonState(inputList, buttonElement); // Обновление состояния кнопки
};