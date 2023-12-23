// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу
const cardList = document.querySelector('.places__list'); //get card location


function deleteCard(event) {
    const deleteButton = event.target;
    const listItem = deleteButton.closest('.places__item');
    listItem.remove();
}

function addCard(cardInfo) {
    const cardTemplate = document.querySelector('#card-template').content; //import card template
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true); //clone card template
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardElement.querySelector('.card__title').textContent = cardInfo.name;
    cardElement.querySelector('.card__image').src = cardInfo.link;
    deleteButton.addEventListener('click', deleteCard);

    return cardElement;
}

initialCards.forEach(function(card) {
    cardList.append(addCard(card));
})