import "/src/index.css"; // добавьте импорт главного файла стилей
import { openModal, closeModal } from "./components/modal.js";
import { createCard, likeCard } from "./components/card.js";
import {
  clearValidation,
  enableValidation,
  validationConfig,
} from "./components/validation.js";
import {
  getInitialData,
  updateProfileDataRequest,
  updateAvatarRequest,
  newCardRequest,
  deleteCardRequest,
} from "./components/api.js";

const popups = document.querySelectorAll(".popup"); // Все попапы
const popupEdit = document.querySelector(".popup_type_edit"); // Попап в виде модального окна редактирования профиля
const popupNewCard = document.querySelector(".popup_type_new-card"); // Попап в виде модального окна добавления карточки
const popupAvatar = document.querySelector(".popup_type-avatar"); // Попап в виде модального окна редактирования аватара
const profileEditBtn = document.querySelector(".profile__edit-button"); // Кнопка редактирования профиля
const newPlaceButton = document.querySelector(".profile__add-button"); // Кнопка добавления карточки
const closeButton = document.querySelectorAll(".popup__close"); // Собираем все кнопки закрытия попап
const profileTitle = document.querySelector(".profile__title"); // Имя владельца профиля
const profileDescription = document.querySelector(".profile__description"); // Описание рода деятельности владельца профиля
const profileImage = document.querySelector(".profile__image"); // Аватар владельца профиля

const editProfileForm = document.querySelector('form[name="edit-profile"]'); // Форма редактирования данных профиля
const submitProfileButton = editProfileForm.querySelector(".button"); // Кнопка подтверждения редактирования данных профиля
const nameInput = editProfileForm.querySelector(".popup__input_type_name"); // Поле ввода имени владельца профиля
const jobInput = editProfileForm.querySelector(
  ".popup__input_type_description"
); // Поле ввода рода деятельности владельца профиля

const cardsContainer = document.querySelector(".places__list");
let cardIdToDelete = '';
let cardToDelete = {};

const newPlaceForm = document.querySelector('form[name="new-place"]'); // Форма добавления новой карточки
const submitNewPlaceButton = newPlaceForm.querySelector(".popup__button"); // Кнопка подтверждения добавления новой карточки
const avatarUpdateForm = document.querySelector('form[name="avatar-update"]'); // Форма обновления аватара
const avatarUpdateButton = avatarUpdateForm.querySelector(".popup__button"); // Кнопка подтверждения изменения аватара
const avatarInput = avatarUpdateForm.querySelector(".popup__input_type_url"); // Поле ввода ссылки на новый аватар
const placeName = document.forms["new-place"].elements["place-name"]; // Поле ввода названия карточки
const imageLink = document.forms["new-place"].elements["link"]; // Поле ввода ссылки на картинку карточки
const popupDelete = document.querySelector(".popup_type_delete");
const cardDeleteSubmitionButton = popupDelete.querySelector('.popup__button-delete-submition');

const popupZoomImage = document.querySelector(".popup_type_image"); // Попап зума карточки
const popupImage = popupZoomImage.querySelector(".popup__image"); // Картинка в попапе карточки
const popupCaption = popupZoomImage.querySelector(".popup__caption"); // Описание в попапе карточки

let userId = "";

const setProfileData = (name, about, avatar) => {
  profileTitle.textContent = name;
  profileDescription.textContent = about;
  profileImage.style.backgroundImage = `url(${avatar})`;
};

getInitialData()
  .then(([profileData, cards]) => {
    // profileData содержит объект { name: 'имя', about: 'описание', avatar: 'ссылка на аватар' }
    // cards содержит массив карточек

    setProfileData(profileData.name, profileData.about, profileData.avatar);
    userId = profileData._id;

    cards.forEach(function (card) {
      cardsContainer.append(
        createCard(
          userId,
          card,
          handleDeleteCardButtonClick,
          likeCard,
          openPopupImage
        )
      );
    });
  })
  .catch((err) => console.error(`Ошибка при загрузке данных. ${err}`));

profileEditBtn.addEventListener("click", function () {
  clearValidation(editProfileForm, validationConfig);
  profileEditBtnClickHandler();
});
newPlaceButton.addEventListener("click", function () {
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

  renderLoading(true, submitProfileButton);
  updateProfileDataRequest(nameInput.value, jobInput.value)
    .then((result) => {
      setProfileData(result.name, result.about, result.avatar);
      closeModal(popupEdit);
    })
    .catch((err) =>
      console.error(`Ошибка при обновлении данных профиля. ${err}`)
    )
    .finally(() => renderLoading(false, submitProfileButton));
}

// Хендлер сабмита формы добавления карточки
function handleNewPlaceSubmit(evt) {
  evt.preventDefault();
  addCard(placeName.value, imageLink.value);
}

// Хендлер нажатия на кнопку удаления карточки
const handleDeleteCardButtonClick = (card, cardId) => {
  openModal(popupDelete);
  cardDeleteSubmitionButton.addEventListener("click", handleDeleteCardSubmit);
  cardIdToDelete = cardId;
  cardToDelete = card;
};

// Хендлер нажатия на кнопку удаления карточки
const handleDeleteCardSubmit = () => {
  renderLoading(true, cardDeleteSubmitionButton);
  deleteCardRequest(cardIdToDelete)
    .then(() => {
      cardToDelete.remove()
      cardDeleteSubmitionButton.removeEventListener("click", handleDeleteCardSubmit);
      closeModal(popupDelete);
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки.", err);
    })
    .finally(() => renderLoading(false, cardDeleteSubmitionButton))
};
// Проверка URL на наличие изображения
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

// Обновление аватара
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

// Хендлер клика на кнопку добавления новой карточки
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
  renderLoading(true, submitNewPlaceButton);

  newCardRequest(placeName, imageLink)
    .then((result) => {
      cardsContainer.prepend(
        createCard(
          userId,
          result,
          handleDeleteCardButtonClick,
          likeCard,
          openPopupImage
        )
      );
      newPlaceForm.reset();
      closeModal(popupNewCard);
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки. ", err);
    })
    .finally(() => {
      renderLoading(false, submitNewPlaceButton);
    });
}
