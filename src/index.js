import "/src/index.css"; // добавьте импорт главного файла стилей
import { openModal, closeModal } from "./components/modal.js";
import {
  cardsContainer,
  createCard,
  likeCard,
  onDelete,
} from "./components/card.js";
import { clearValidation, enableValidation } from "./components/validation.js";
import {
  getInitialData,
  updateProfileDataRequest,
  updateAvatarRequest,
  newCardRequest,
} from "./components/api.js";

export { handleNewPlaceSubmit, handleEditProfileSubmit, prepareProfileForm };

const popups = document.querySelectorAll(".popup"); // Все попапы
const popupEdit = document.querySelector(".popup_type_edit"); // Попап в виде модального окна редактирования профиля
const popupNewCard = document.querySelector(".popup_type_new-card"); // Попап в виде модального окна добавления карточки
const popupAvatar = document.querySelector(".popup_type-avatar");
const profileEditBtn = document.querySelector(".profile__edit-button"); // Кнопка редактирования профиля
const addButton = document.querySelector(".profile__add-button"); // Кнопка добавления карточки
const closeButton = document.querySelectorAll(".popup__close"); // Собираем все кнопки закрытия попап
const profileTitle = document.querySelector(".profile__title"); // Имя владельца профиля
const profileDescription = document.querySelector(".profile__description"); // Описание рода деятельности владельца профиля
const profileImage = document.querySelector(".profile__image"); // Аватар владельца профиля

const editProfileForm = document.querySelector('form[name="edit-profile"]'); // Форма редактирования профиля
const editProfileButton = editProfileForm.querySelector(".button");
const nameInput = editProfileForm.querySelector(".popup__input_type_name"); // Поле ввода имени владельца профиля
const jobInput = editProfileForm.querySelector(
  ".popup__input_type_description"
); // Поле ввода рода деятельности владельца профиля

const newPlaceForm = document.querySelector('form[name="new-place"]'); // Форма добавления новой карточки
const newPlaceButton = newPlaceForm.querySelector(".popup__button");
const avatarUpdateForm = document.querySelector('form[name="avatar-update"]');
const avatarUpdateButton = avatarUpdateForm.querySelector(".popup__button");
const avatarInput = avatarUpdateForm.querySelector(".popup__input_type_url");
const placeName = document.forms["new-place"].elements["place-name"]; // Поле ввода названия карточки
const imageLink = document.forms["new-place"].elements["link"]; // Поле ввода ссылки на картинку карточки

const popupZoomImage = document.querySelector(".popup_type_image"); // Попап зума карточки
const popupImage = popupZoomImage.querySelector(".popup__image"); // Картинка в попапе карточки
const popupCaption = popupZoomImage.querySelector(".popup__caption"); // Описание в попапе карточки

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const setProfileData = (name, about, avatar) => {
  profileTitle.textContent = name;
  profileDescription.textContent = about;
  profileImage.style.backgroundImage = `url(${avatar})`;
};

getInitialData().then(([profileData, cards]) => {
  // profileData содержит объект { name: 'имя', about: 'описание', avatar: 'ссылка на аватар' }
  // cards содержит массив карточек

  setProfileData(profileData.name, profileData.about, profileData.avatar);

  cards.forEach(function (card) {
    cardsContainer.append(createCard(card, onDelete, likeCard, openPopupImage));
  });
});

profileEditBtn.addEventListener("click", function () {
  clearValidation(editProfileForm, validationConfig);
  profileEditBtnClickHandler();
});
addButton.addEventListener("click", function () {
  newPlaceBtnClickHandler();
  clearValidation(newPlaceForm, validationConfig);
});
editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPlaceForm.addEventListener("submit", handleNewPlaceSubmit);
profileImage.addEventListener("click", function () {
  clearValidation(avatarUpdateForm, validationConfig);
  openModal(popupAvatar);
});
avatarUpdateForm.addEventListener("submit", updateAvatar);

enableValidation(validationConfig);

// Для каждой кнопки закрытия попапа устанавливаем слушатель
closeButton.forEach((button) => {
  button.addEventListener("click", function () {
    const popup = button.closest(".popup");
    if (popup) {
      closeModal(popup);
    }
  });
});

// Для каждого попапа устанавливаем слушатель и закрываем по клику на оверлей
popups.forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("popup")) {
      closeModal(popup);
    }
  });
});

// Хендлер сабмита формы редактирования профиля
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, editProfileButton);
  updateProfileDataRequest(nameInput.value, jobInput.value)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else return Promise.reject(`Ошибка: ${res.status}`);
    })
    .then((result) => {
      setProfileData(result.name, result.about, result.avatar);
    })
    .catch((err) => console.error(`Ошибка при обновлении данных профиля. ${err}`))
    .finally(() => renderLoading(false, editProfileButton));

  closeModal(popupEdit);
}

// Хендлер сабмита формы добавления карточки
function handleNewPlaceSubmit(evt) {
  evt.preventDefault();
  addCard(placeName.value, imageLink.value);
  closeModal(popupNewCard);
}

function checkIfImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      resolve(true);
    };
    img.onerror = function () {
      resolve(false);
    };
    img.src = url;
  });
}

function updateAvatar(evt) {
  evt.preventDefault();
  renderLoading(true, avatarUpdateButton);
  checkIfImage(`${avatarInput.value}`)
    .then((isImage) => {
      if (isImage) {
        updateAvatarRequest(avatarInput.value);
      } else {
        console.error("URL не содержит изображение");
      }
    })
    .then(() => {
      setProfileData(
        profileTitle.textContent,
        profileDescription.textContent,
        avatarInput.value
      );
    })
    .then(() => closeModal(popupAvatar))
    .catch((error) => {
      console.error("Ошибка при проверке изображения.", error);
    })
    .finally(() => {
      renderLoading(false, avatarUpdateButton);
    });
}

function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
}

// Заполнение формы перед открытием модального окна
function prepareProfileForm() {
  const getValue = (selector) => document.querySelector(selector).textContent;
  nameInput.value = getValue(".profile__title");
  jobInput.value = getValue(".profile__description");
}

// Хендлер клика на кнопку редактирования профиля
function profileEditBtnClickHandler() {
  prepareProfileForm();
  openModal(popupEdit);
}

function newPlaceBtnClickHandler() {
  clearValidation(newPlaceForm, validationConfig);
  openModal(popupNewCard);
}

// Открыть попап изображения
function openPopupImage(imageData) {
  popupImage.setAttribute("src", imageData.link);
  popupImage.setAttribute("alt", imageData.description);
  popupCaption.textContent = imageData.title;
  openModal(popupZoomImage);
}

// Добавить карточку
function addCard(placeName, imageLink) {
  renderLoading(true, newPlaceButton);

  newCardRequest(placeName, imageLink)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else return Promise.reject(`Ошибка: ${res.status}`);
    })
    .then((result) => {
      cardsContainer.prepend(
        createCard(result, onDelete, likeCard, openPopupImage)
      );
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки. ", err);
    })
    .finally(() => {
      renderLoading(false, newPlaceButton);
    });

  newPlaceForm.reset();
}
