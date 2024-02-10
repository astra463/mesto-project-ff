# Проект "Mesto"

Проект "Mesto" - это веб-приложение, которое позволяет пользователям делиться фотографиями своих любимых мест. Пользователи могут загружать изображения мест, которые они посетили или которые им нравятся, и просматривать фотографии других пользователей. Каждая фотография может быть оценена другими пользователями путем добавления лайка. У каждого пользователя есть свой профиль, где они могут изменить свои данные и загрузить собственное фото профиля.

## Установка

Для запуска проекта на локальной машине выполните следующие шаги:

1. Клонируйте репозиторий на свой компьютер:
```bash
git clone https://github.com/your_username/mesto-project.git
```
2. Перейдите в директорию проекта:
```bash
cd mesto-project
```
3. Установите зависимости:
```bash
npm install
```

## Использование

<script>
document.addEventListener("DOMContentLoaded", function() {
  var image = document.querySelector("#image-container img");
  var loader = document.querySelector("#loader");

  image.onload = function() {
    loader.style.display = "none";
    image.style.display = "block";
  };

  image.onerror = function() {
    loader.style.display = "none";
    image.style.display = "none";
  };
});
</script>

1. **Изменение профиля:** В разделе профиля пользователь может изменить свои данные, такие как имя и информацию о себе, а также загрузить новое фото профиля.
<div id="image-container" style="text-align:center;">
  <img src="gif/editprofile.gif" alt="Пример изменения профиля" style="display:none;">
  <img src="gif/spinner.gif" alt="Идет загрузка..." width="100" height="100" id="loader">
</div>

2. **Добавление нового места:** На главной странице пользователь может добавить новое место, указав название места и ссылку на фотографию.
<div id="image-container" style="text-align:center;">
  <img src="gif/newplace.gif" alt="Пример изменения профиля" style="display:none;">
  <img src="gif/spinner.gif" alt="Идет загрузка..." width="100" height="100" id="loader">
</div>

3. **Лайки:** Пользователь может оценить фотографию другого пользователя, нажав на кнопку "Лайк".
<div id="image-container" style="text-align:center;">
  <img src="gif/likes.gif" alt="Пример изменения профиля" style="display:none;">
  <img src="gif/spinner.gif" alt="Идет загрузка..." width="100" height="100" id="loader">
</div>

## Доступ

На данный момент приложение доступно только для учеников практикума.

## Ссылка на репозиторий

https://github.com/astra463/mesto-project-ff.git
