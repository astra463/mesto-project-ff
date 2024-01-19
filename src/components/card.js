export {deleteCard, createCard, addCard, likeCard, openPopupImage}
import { addKeyDownListener } from './modal.js'
export const cardsContainer = document.querySelector('.places__list'); 

function getImageData(card) {
  return {
    title: card.querySelector('.card__title').textContent,
    link: card.querySelector('.card__image').getAttribute('src'),
    description: card.querySelector('.card__image').getAttribute('alt'),
  };
}

function openPopupImage(imageData) {
  const popup = document.querySelector('.popup_type_image');
  const popupImage = popup.querySelector('.popup__image')
  const popupCaption = popup.querySelector('.popup__caption')
  
  popupImage.setAttribute('src', imageData.link);
  popupImage.setAttribute('alt', imageData.description);
  popupCaption.textContent = imageData.title;
  popup.classList.toggle('popup_is-opened');

  addKeyDownListener();
}

function deleteCard(card) {
  card.remove();
}

function likeCard(cardLikeButton) {
  cardLikeButton.classList.toggle('card__like-button_is-active');
}

function createCard(cardData, onDelete, onLike, onImageClick) {
  const cardTemplate = document.querySelector('#card-template').content.querySelector('.places__item'); 
  const cardElement = cardTemplate.cloneNode(true); 
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardImage = cardElement.querySelector('.card__image');

  cardElement.querySelector('.card__title').textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.description;
  
  cardElement.querySelector('.card__image').addEventListener('click', () => onLike(cardElement));
  deleteButton.addEventListener('click', () => onDelete(cardElement));
  cardLikeButton.addEventListener('click', () => onLike(cardLikeButton));
  cardImage.addEventListener('click', () => onImageClick(getImageData(cardElement)));

  return cardElement;
}

function addCard(placeName, imageLink){
  const cardHolder = {
    name: placeName,
    link: imageLink
  }
  cardsContainer.prepend(createCard(cardHolder, deleteCard, likeCard, openPopupImage));
  document.forms['new-place'].reset();
};