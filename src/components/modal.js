// экспортируйте функции openModal и closeModal, принимающие в качестве аргумента 
// DOM-элемент модального окна, с которым нужно произвести действие.

import { addCard } from "./card.js"

export {openModal, closeModal, handleFormSubmit, addKeyDownListener, onEscapePressed}

function handleFormSubmit(evt) {  
  evt.preventDefault();

  if (evt.target.getAttribute('name') === 'edit-profile') {
    const formElement = document.querySelector('.popup__form');
    const nameInput = formElement.querySelector('.popup__input_type_name');
    const jobInput = formElement.querySelector('.popup__input_type_description');
    const name = nameInput.value;
    const job = jobInput.value;
    document.querySelector('.profile__title').textContent = name;
    document.querySelector('.profile__description').textContent = job;
    document.querySelector('.popup').classList.toggle("popup_is-opened", false);
  }

  else if (evt.target.getAttribute('name') === 'new-place') {
    const placeName = document.forms['new-place'].elements['place-name'].value;
    const imageLink = document.forms['new-place'].elements['link'].value;
    addCard(placeName, imageLink);
    document.querySelector('.popup_type_new-card').classList.toggle("popup_is-opened", false);
  }
}

function openModal(popup){
  prepareProfileForm();
  popup.querySelector('.popup__form').addEventListener('submit', handleFormSubmit);
  popup.classList.toggle("popup_is-opened", true); 
  addKeyDownListener(); // Добавили слушатель в случае открытия модального окна
}

function prepareProfileForm() {
  const getValue = (selector) => document.querySelector(selector).textContent;
  const nameField = document.forms['edit-profile'].elements['name'];
  const descriptionField = document.forms['edit-profile'].elements['description'];

  nameField.value = getValue('.profile__title');
  descriptionField.value = getValue('.profile__description');
}

function closeModal(popup){
  popup.classList.toggle('popup_is-opened', false);
}

function addKeyDownListener() {
  document.addEventListener('keydown', onEscapePressed);
}

function onEscapePressed(evt) {
  const popupToClose = document.querySelector('.popup_is-opened')

  if (evt.key === 'Escape'){
    popupToClose.classList.toggle('popup_is-opened', false);
    document.removeEventListener('keydown', onEscapePressed);
  }
}

