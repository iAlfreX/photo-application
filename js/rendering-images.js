"use strict";

export const photosWrapper = document.querySelector(".pictures");
const photosTemplate = document.querySelector("#picture").content;

export function fillBasicPhotoData(
  imgEl,
  commentsEl,
  likesEl,
  photoDescription
) {
  imgEl.src = photoDescription.url;
  commentsEl.textContent = photoDescription.comments.length;
  likesEl.textContent = photoDescription.likes;
}

function createPhotoTemplate(photoDescription) {
  const photoTemplate = photosTemplate.cloneNode(true);
  const imgElement = photoTemplate.querySelector(".picture__img");
  const commentsElement = photoTemplate.querySelector(".picture__comments");
  const likesElement = photoTemplate.querySelector(".picture__likes");
  fillBasicPhotoData(
    imgElement,
    commentsElement,
    likesElement,
    photoDescription
  );
  return photoTemplate;
}

export function displayAllPhotos(photoDescriptions) {
  const photosFragment = document.createDocumentFragment();
  photoDescriptions.forEach((photoDescription) => {
    const photoTemplate = createPhotoTemplate(photoDescription);
    photosFragment.appendChild(photoTemplate);
  });
  photosWrapper.appendChild(photosFragment);
}
