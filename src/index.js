import '/src/index.css'; // добавьте импорт главного файла стилей 
import {openModal, closeModal} from './components/modal.js'
import { initialCards } from './cards.js'
import { cardsContainer, createCard, deleteCard, likeCard } from './components/card.js'

export { handleNewPlaceSubmit, handleEditProfileSubmit, prepareProfileForm};

const popups = document.querySelectorAll('.popup'); // Все попапы
const popupEdit = document.querySelector('.popup_type_edit'); // Попап в виде модального окна редактирования профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); // Попап в виде модального окна добавления карточки
const profileEditBtn = document.querySelector('.profile__edit-button'); // Кнопка редактирования профиля
const addButton = document.querySelector('.profile__add-button'); // Кнопка добавления карточки
const closeButton = document.querySelectorAll('.popup__close'); // Собираем все кнопки закрытия попап
const profileTitle = document.querySelector('.profile__title'); // Имя владельца профиля
const profileDescription = document.querySelector('.profile__description'); // Описание рода деятельности владельца профиля

const editProfileForm = document.querySelector('form[name="edit-profile"]'); // Форма редактирования профиля
const nameInput = editProfileForm.querySelector('.popup__input_type_name'); // Поле ввода имени владельца профиля
const jobInput = editProfileForm.querySelector('.popup__input_type_description'); // Поле ввода рода деятельности владельца профиля

const newPlaceForm = document.querySelector('form[name="new-place"]'); // Форма добавления новой карточки
const placeName = document.forms['new-place'].elements['place-name']; // Поле ввода названия карточки
const imageLink = document.forms['new-place'].elements['link']; // Поле ввода ссылки на картинку карточки

const popupZoomImage = document.querySelector('.popup_type_image'); // Попап зума карточки 
const popupImage = popupZoomImage.querySelector('.popup__image');  // Картинка в попапе карточки
const popupCaption = popupZoomImage.querySelector('.popup__caption'); // Описание в попапе карточки

profileEditBtn.addEventListener('click', profileEditBtnClickHandler); 
addButton.addEventListener('click', () => openModal(popupNewCard));
editProfileForm.addEventListener('submit', handleEditProfileSubmit);
newPlaceForm.addEventListener('submit', handleNewPlaceSubmit);

initialCards.forEach(function(card) {
  cardsContainer.append(createCard(card, deleteCard, likeCard, openPopupImage));
})

// Для каждой кнопки закрытия попапа устанавливаем слушатель 
closeButton.forEach(button => {
  button.addEventListener('click', function() {
    const popup = button.closest('.popup');
    if (popup) {
      closeModal(popup);
    }
  });
});

// Для каждого попапа устанавливаем слушатель и закрываем по клику на оверлей
popups.forEach(popup => {
  popup.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('popup')) {
      closeModal(popup);
    }
  });
});

// Хендлер сабмита формы редактирования профиля
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const name = nameInput.value;
  const job = jobInput.value;
  profileTitle.textContent = name;
  profileDescription.textContent = job;
  closeModal(popupEdit);
}

// Хендлер сабмита формы добавления карточки
function handleNewPlaceSubmit(evt) {
  evt.preventDefault();

  addCard(placeName.value, imageLink.value);
  closeModal(popupNewCard);
}

// Заполнение формы перед открытием модального окна
function prepareProfileForm() {
  const getValue = (selector) => document.querySelector(selector).textContent;
  nameInput.value = getValue('.profile__title');
  jobInput.value = getValue('.profile__description');
}

// Хендлер клика на кнопку редактирования профиля
function profileEditBtnClickHandler() {
  prepareProfileForm();
  openModal(popupEdit);
}

// Открыть попап изображения
function openPopupImage(imageData) {
  popupImage.setAttribute('src', imageData.link);
  popupImage.setAttribute('alt', imageData.description);
  popupCaption.textContent = imageData.title;
  openModal(popupZoomImage);
}

// Добавить карточку 
function addCard(placeName, imageLink){
  const cardHolder = {
    name: placeName,
    link: imageLink
  }
  cardsContainer.prepend(createCard(cardHolder, deleteCard, likeCard, openPopupImage));
  newPlaceForm.reset();
};