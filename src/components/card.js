import { closeModal, openModal } from "./modal";

export { onDelete, createCard, likeCard, updateLikes };
export const cardsContainer = document.querySelector(".places__list");

function getImageData(card) {
  return {
    title: card.querySelector(".card__title").textContent,
    link: card.querySelector(".card__image").getAttribute("src")  
  };
}

function onDelete(card, cardId) {
  const popupDelete = document.querySelector(".popup_type_delete");
  openModal(popupDelete);
  document
    .querySelector(".popup__button-delete-submition")
    .addEventListener("click", function () {
      fetch(`https://nomoreparties.co/v1/wff-cohort-6/cards/${cardId}`, {
        method: "DELETE",
        headers: {
          authorization: "60dbb4ef-dcf2-4bbc-b6fa-bf33636f3012",
          "Content-Type": "application/json",
        },
      }).then(() => {
        deleteCard(card);
      });

      closeModal(popupDelete);
    });
}

function deleteCard(card) {
  card.remove();
}

function likeCard(likeButton, cardId) {
  const isMyLikeOnCard = likeButton.classList.contains('card__like-button_is-active');

  if (!isMyLikeOnCard) {
    fetch(`https://nomoreparties.co/v1/wff-cohort-6/cards/likes/${cardId}`, {
      method: "PUT",
      headers: {
        authorization: "60dbb4ef-dcf2-4bbc-b6fa-bf33636f3012",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        updateLikes(result.likes, likeButton);
      });
  } else if (isMyLikeOnCard) {
    fetch(`https://nomoreparties.co/v1/wff-cohort-6/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: "60dbb4ef-dcf2-4bbc-b6fa-bf33636f3012",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        updateLikes(result.likes, likeButton);
      });
  }
}

const updateLikes = (serverResponse, likeButton) => {
  const likesAmount = likeButton.parentNode.querySelector('.card__likes-amount');
  const isLiked = serverResponse.some(like => like._id === '8f79ba7b6944f463df9405ec');
  
  likeButton.classList.toggle("card__like-button_is-active", isLiked);
  likesAmount.textContent = serverResponse.length;
};

function createCard(cardData, onDelete, onLike, onImageClick) {
  const cardElement = getCardTemplate();
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikesAmount = cardElement.querySelector(".card__likes-amount");
  
  if (cardData.owner._id !== "8f79ba7b6944f463df9405ec") {
    deleteButton.remove();
  }

  updateLikes(cardData.likes, cardLikeButton);

  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardImage.src = cardData.link;
  cardLikesAmount.textContent = cardData.likes.length;

  deleteButton.addEventListener("click", () => onDelete(cardElement, cardData._id));
  cardLikeButton.addEventListener("click", () => onLike(cardLikeButton, cardData._id));
  cardImage.addEventListener("click", () => onImageClick(getImageData(cardElement)));

  return cardElement;
}

function getCardTemplate() {
  return document
    .querySelector("#card-template")
    .content.querySelector(".places__item")
    .cloneNode(true);
}
