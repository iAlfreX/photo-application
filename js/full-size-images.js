"use strict";

import { photosWrapper, fillBasicPhotoData } from "./rendering-images.js";

const body = document.querySelector("body");
const imageModalWindow = document.querySelector(".big-picture");
const commentsWrapper = imageModalWindow.querySelector(".social__comments");
document.addEventListener("keydown", handleKeyClick);

export function activateFullSizePhotoMode(photoDescriptions) {
  photosWrapper.addEventListener("click", (event) => {
    handleClickOnThumbnail(photoDescriptions, event);
  });
  imageModalWindow
    .querySelector(".big-picture__cancel")
    .addEventListener("click", closefullSizePhotoMode);
}

function handleClickOnThumbnail(photoDescriptions, event) {
  const clickedElement = event.target;

  if (clickedElement.tagName === "IMG") {
    const imageID = extractNumberFromPath(clickedElement.src);

    if (imageID) {
      const photoDescription = photoDescriptions.find(
        (photoDescription) => photoDescription.id === imageID
      );
      openfullSizePhotoMode(photoDescription);
    }
  }
}

function extractNumberFromPath(path) {
  const pathParts = path.split("/");
  const fileName = pathParts[pathParts.length - 1];

  if (fileName.endsWith(".jpg")) {
    const numberStr = fileName.replace(".jpg", "");
    const number = +numberStr;

    if (!isNaN(number)) {
      return number;
    }
  }

  return null;
}

function fillFullSizePhotoModeWithData(photoDescription) {
  const imageElement = imageModalWindow.querySelector("img");
  const likesElement = imageModalWindow.querySelector(".likes-count");
  const commentsElement = imageModalWindow.querySelector(".comments-count");
  const descriptionElement = imageModalWindow.querySelector(".social__caption");
  fillBasicPhotoData(
    imageElement,
    commentsElement,
    likesElement,
    photoDescription
  );
  fillCommentsBlock(photoDescription.comments);
  descriptionElement.textContent = photoDescription.description;
}

function openfullSizePhotoMode(photoDescription) {
  const commentsCounter = imageModalWindow.querySelector(
    ".social__comment-count"
  );
  fillFullSizePhotoModeWithData(photoDescription);
  imageModalWindow.classList.remove("hidden");
  imageModalWindow.scrollTop = 0;
  body.classList.add("modal-open");
  commentsCounter.style.display = "none";
}

function closefullSizePhotoMode(event) {
  const clickedElement = event.target;

  if (clickedElement.tagName === "BUTTON") {
    imageModalWindow.classList.add("hidden");
    body.classList.remove("modal-open");
  }
}

function fillCommentsBlock(comments) {
  const commentsFragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentTemplate = createCommentTemplate(comment);
    commentsFragment.appendChild(commentTemplate);
  });
  commentsWrapper.innerHTML = "";
  commentsWrapper.appendChild(commentsFragment);
}

function createCommentTemplate(comment) {
  const commentTemplate = commentsWrapper
    .querySelector(".social__comment")
    .cloneNode(true);
  const commentAvatar = commentTemplate.querySelector(".social__picture");
  const commentText = commentTemplate.querySelector(".social__text");
  commentAvatar.src = comment.avatar;
  commentAvatar.alt = comment.name;
  commentText.textContent = comment.message;
  return commentTemplate;
}

function handleKeyClick(event) {
  const isFullSizePhotoModeOpen =
    !imageModalWindow.classList.contains("hidden");

  if (event.key === "Escape" && isFullSizePhotoModeOpen) {
    imageModalWindow.classList.add("hidden");
    body.classList.remove("modal-open");
  }
}
