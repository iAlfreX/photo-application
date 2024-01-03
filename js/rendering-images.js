"use strict";

const photosWrapper = document.querySelector(".pictures");
const photosTemplate = document.querySelector("#picture").content;

function createPhotoTemplate(photoDescription) {
  const photoTemplate = photosTemplate.cloneNode(true);
  const imgElement = photoTemplate.querySelector(".picture__img");
  const commentsElement = photoTemplate.querySelector(".picture__comments");
  const likesElement = photoTemplate.querySelector(".picture__likes");
  imgElement.src = photoDescription.url;
  commentsElement.textContent = photoDescription.comments.length;
  likesElement.textContent = photoDescription.likes;
  return photoTemplate;
}

function createAllPhotosTemplate(photoDescriptions) {
  const fragment = document.createDocumentFragment();
  photoDescriptions.forEach((photoDescription) => {
    const photoTemplate = createPhotoTemplate(photoDescription);
    fragment.appendChild(photoTemplate);
  });
  return fragment;
}

export function displayPhoto(photoDescription) {
  const photoFragment = createPhotoTemplate(photoDescription);
  photosWrapper.appendChild(photoFragment);
}

export function displayAllPhotos(photoDescriptions) {
  const photosFragment = createAllPhotosTemplate(photoDescriptions);
  photosWrapper.appendChild(photosFragment);
}
