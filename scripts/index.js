// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const cardTemplate = document.querySelector('#card-template').content.querySelector('.places__item'); 
const cardsContainer = document.querySelector('.places__list'); 

function deleteCard(card) {
    card.remove();
}

function createCard(cardData, onDelete) {
    const cardElement = cardTemplate.cloneNode(true); 
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardElement.querySelector('.card__title').textContent = cardData.name;
    cardElement.querySelector('.card__image').src = cardData.link;
    cardElement.querySelector('.card__image').alt = cardData.description;
    deleteButton.addEventListener('click', () => onDelete(cardElement))

    return cardElement;
}

initialCards.forEach(function(card) {
    cardsContainer.append(createCard(card, deleteCard));
})