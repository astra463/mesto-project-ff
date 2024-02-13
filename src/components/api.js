const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-6",
  headers: {
    authorization: "60dbb4ef-dcf2-4bbc-b6fa-bf33636f3012",
    "Content-Type": "application/json",
  },
};

// Запрос данных профиля и карточек
const getInitialData = () => {
  const getProfileData = () => {
    return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers,
    }).then((res) => isRequestSuccess(res));
  };

  const getCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers,
    }).then((res) => isRequestSuccess(res));
  };

  return Promise.all([getProfileData(), getCards()]);
};

const updateProfileDataRequest = (newName, newJob) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      about: newJob,
    }),
  }).then((res) => isRequestSuccess(res));
};

const updateAvatarRequest = (avatarLink) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarLink,
    }),
  }).then((res) => isRequestSuccess(res));
};

const newCardRequest = (placeName, imageLink) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: placeName,
      link: imageLink,
    }),
  }).then((res) => isRequestSuccess(res));
};

const deleteCardRequest = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then((res) => isRequestSuccess(res));
};

const putLikeRequest = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then((res) => isRequestSuccess(res));
};

const deleteLikeRequest = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then((res) => isRequestSuccess(res));
};

const isRequestSuccess = (res) => {
  if (res.ok) {
    return res.json();
  } else return Promise.reject(`Ошибка: ${res.status}`);
};

export {
  getInitialData,
  updateProfileDataRequest,
  updateAvatarRequest,
  newCardRequest,
  deleteCardRequest,
  putLikeRequest,
  deleteLikeRequest,
};
