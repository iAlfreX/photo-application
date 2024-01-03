"use strict";

import { createPhotoDescriptions } from "./main.js";

function displayPhoto(photoDescription) {
  const photosWrapper = document.querySelector(".pictures");
  const templateForPhotos = document
    .querySelector("#picture")
    .content.cloneNode(true);
  const imgElement = templateForPhotos.querySelector(".picture__img");
  const commentsElement = templateForPhotos.querySelector(".picture__comments");
  const likesElement = templateForPhotos.querySelector(".picture__likes");
  const fragment = document.createDocumentFragment();
  fragment.appendChild(templateForPhotos);
  imgElement.src = photoDescription.url;
  commentsElement.textContent = photoDescription.comments.length;
  likesElement.textContent = photoDescription.likes;
  photosWrapper.appendChild(fragment);
}

function dipslayAllPhotos(photoDescriptions) {
  photoDescriptions.forEach((photoDescription) => {
    displayPhoto(photoDescription);
  });
}

createPhotoDescriptions()
  .then((photoDescriptions) => {
    dipslayAllPhotos(photoDescriptions);
  })
  .catch((error) =>
    console.error(
      `Ошибка при выполнении createPhotoDescriptions: ${error.message}`
    )
  );
