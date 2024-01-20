export {deleteCard, createCard, likeCard}
export const cardsContainer = document.querySelector('.places__list'); 

function getImageData(card) {
  return {
    title: card.querySelector('.card__title').textContent,
    link: card.querySelector('.card__image').getAttribute('src'),
    description: card.querySelector('.card__image').getAttribute('alt'),
  };
}

function deleteCard(card) {
  card.remove();
}

function likeCard(cardLikeButton) {
  cardLikeButton.classList.toggle('card__like-button_is-active');
}

function createCard(cardData, onDelete, onLike, onImageClick) {
  const cardElement = getCardTemplate();  
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

function getCardTemplate() {
  return document.querySelector('#card-template').content.querySelector('.places__item').cloneNode(true);
}

