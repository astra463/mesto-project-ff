import { putLikeRequest, deleteLikeRequest } from "./api";

function getImageData(card) {
  return {
    title: card.querySelector(".card__title").textContent,
    link: card.querySelector(".card__image").getAttribute("src"),
  };
}

function likeCard(userId, likeButton, cardId) {
  const isMyLikeOnCard = likeButton.classList.contains(
    "card__like-button_is-active"
  );

  if (!isMyLikeOnCard) {
    putLikeRequest(cardId)
      .then((result) => {
        updateLikes(userId, result.likes, likeButton);
      })
      .catch((err) => console.error(`Ошибка при отправке запроса ${err}`));
  } else if (isMyLikeOnCard) {
    deleteLikeRequest(cardId)
      .then((result) => {
        updateLikes(userId, result.likes, likeButton);
      })
      .catch((err) => console.error(`Ошибка при отправке запроса ${err}`));
  }
}

const updateLikes = (userId, serverResponse, likeButton) => {
  const likesAmount = likeButton.parentNode.querySelector(
    ".card__likes-amount"
  );
  const isLiked = serverResponse.some((like) => like._id === userId);

  likeButton.classList.toggle("card__like-button_is-active", isLiked);
  likesAmount.textContent = serverResponse.length;
};

function createCard(userId, cardData, onDelete, onLike, onImageClick) {
  const cardElement = getCardTemplate();
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikesAmount = cardElement.querySelector(".card__likes-amount");

  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  }

  updateLikes(userId, cardData.likes, cardLikeButton);

  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardImage.src = cardData.link;
  cardLikesAmount.textContent = cardData.likes.length;

  deleteButton.addEventListener("click", () =>
    onDelete(cardElement, cardData._id)
  );
  cardLikeButton.addEventListener("click", () =>
    onLike(userId, cardLikeButton, cardData._id)
  );
  cardImage.addEventListener("click", () =>
    onImageClick(getImageData(cardElement))
  );

  return cardElement;
}

function getCardTemplate() {
  return document
    .querySelector("#card-template")
    .content.querySelector(".places__item")
    .cloneNode(true);
}

export { createCard, likeCard };
