// экспортируйте функции openModal и closeModal, принимающие в качестве аргумента 
// DOM-элемент модального окна, с которым нужно произвести действие.
export {openModal, closeModal, addKeyDownListener, onEscapePressed}

function openModal(popup) {
  popup.classList.toggle("popup_is-opened", true); 
  addKeyDownListener();
}

function closeModal(popup){
  popup.classList.toggle('popup_is-opened', false);
  document.removeEventListener('keydown', onEscapePressed);
}

function addKeyDownListener() {
  document.addEventListener('keydown', onEscapePressed);
}

function onEscapePressed(evt) {
  if (evt.key === 'Escape'){
    const popupToClose = document.querySelector('.popup_is-opened')
    closeModal(popupToClose);
  }
}






