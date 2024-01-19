import '/src/index.css'; // добавьте импорт главного файла стилей 
import {openModal, closeModal, onEscapePressed} from './components/modal.js'
import { initialCards } from './cards.js'
import { cardsContainer, createCard, deleteCard, likeCard, openPopupImage } from './components/card.js'

const profileEditBtn = document.querySelector('.profile__edit-button'); // Кнопка редактирования профиля
const popupEdit = document.querySelector('.popup_type_edit'); // Попап в виде модального окна редактирования профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); // Попап в виде модального окна добавления карточки
const addButton = document.querySelector('.profile__add-button'); // Кнопка добавления карточки

profileEditBtn.addEventListener('click', () => openModal(popupEdit)); 
addButton.addEventListener('click', () => openModal(popupNewCard));


initialCards.forEach(function(card) {
  cardsContainer.append(createCard(card, deleteCard, likeCard, openPopupImage));
})

document.addEventListener('click', function(evt){
  const popup = evt.target.closest('.popup');

  if (popup && evt.target.classList.contains('popup__close')){
    closeModal(popup);
    document.removeEventListener('keydown', onEscapePressed);
  }
})

document.addEventListener('click', (evt) => {
  const activePopup = document.querySelector('.popup_is-opened');

  if (evt.target.classList.contains('popup')){
    closeModal(activePopup);
    document.removeEventListener('keydown', onEscapePressed);
  }
})