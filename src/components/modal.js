function openModal(popup) {
  popup.classList.toggle("popup_is-opened", true);
  addKeyDownListener();
}

function closeModal(popup) {
  popup.classList.toggle("popup_is-opened", false);
  document.removeEventListener("keydown", onEscapePressed);
}

function addKeyDownListener() {
  document.addEventListener("keydown", onEscapePressed);
}

function onEscapePressed(evt) {
  if (evt.key === "Escape") {
    const popupToClose = document.querySelector(".popup_is-opened");
    closeModal(popupToClose);
  }
}

export { openModal, closeModal, addKeyDownListener };
