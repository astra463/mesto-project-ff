export {
  getInitialData,
  updateProfileDataRequest,
  updateAvatarRequest,
  newCardRequest,
};

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
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((result) => {
        return {
          name: result.name,
          about: result.about,
          avatar: result.avatar,
        };
      })
      .catch((err) =>
        console.error(`Ошибка при загрузке данных профиля. ${err}`)
      );
  };

  const getCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((data) => {
        return data;
      })
      .catch((err) => 
      console.error(`Ошибка при загрузке карточек. ${err}`)
      )
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
  });
};

const updateAvatarRequest = (avatarLink) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarLink,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        console.error("Не удалось обновить аватар");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара.", error);
    });
};

const newCardRequest = (placeName, imageLink) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: placeName,
      link: imageLink,
    }),
  });
};
