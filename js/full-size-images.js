"use strict";

import { photosWrapper } from "./rendering-images.js";

const body = document.body;
const imageModalWindow = document.querySelector(".big-picture");
const commentsTemplate = document.querySelector("#social__comment").content;
document.addEventListener("keydown", handleKeyClick);

export function activateFullSizePhotoMode(photoDescriptions) {
  const closeButton = imageModalWindow.querySelector(".big-picture__cancel");
  photosWrapper.addEventListener("click", (event) => {
    handleClickOnThumbnail(photoDescriptions, event);
  });
  closeButton.addEventListener("click", closeFullSizePhotoMode);
}

function handleClickOnThumbnail(photoDescriptions, event) {
  const clickedElement = event.target;

  if (clickedElement.className === "picture__img") {
    const imageID = +clickedElement.dataset.id;
    const photoDescription = photoDescriptions.find(
      (photoDescription) => photoDescription.id === imageID
    );
    openFullSizePhotoMode(photoDescription);
  }
}

function handleKeyClick(event) {
  const isFullSizePhotoModeOpen =
    !imageModalWindow.classList.contains("hidden");

  if (isFullSizePhotoModeOpen) {
    if (event.key === "Escape") {
      closeFullSizePhotoMode();
    }
  }
}

function openFullSizePhotoMode(photoDescription) {
  const commentsCounter = imageModalWindow.querySelector(
    ".social__comment-count"
  );
  fillFullSizePhotoModeWithData(photoDescription);
  imageModalWindow.classList.remove("hidden");
  imageModalWindow.scrollTop = 0;
  body.classList.add("modal-open");
  commentsCounter.style.display = "none";
}

function closeFullSizePhotoMode() {
  imageModalWindow.classList.add("hidden");
  body.classList.remove("modal-open");
}

function fillFullSizePhotoModeWithData(photoDescription) {
  const imageElement = imageModalWindow.querySelector("img");
  const likesElement = imageModalWindow.querySelector(".likes-count");
  const commentsElement = imageModalWindow.querySelector(".comments-count");
  const descriptionElement = imageModalWindow.querySelector(".social__caption");
  imageElement.src = photoDescription.url;
  likesElement.textContent = photoDescription.likes;
  commentsElement.textContent = photoDescription.comments.length;
  descriptionElement.textContent = photoDescription.description;
  fillCommentsBlock(photoDescription.comments);
}

function fillCommentsBlock(comments) {
  const commentsWrapper = imageModalWindow.querySelector(".social__comments");
  const commentsFragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentTemplate = createCommentTemplate(comment);
    commentsFragment.appendChild(commentTemplate);
  });
  commentsWrapper.innerHTML = "";
  commentsWrapper.appendChild(commentsFragment);
}

function createCommentTemplate(comment) {
  const commentTemplate = commentsTemplate.cloneNode(true);
  const commentAvatar = commentTemplate.querySelector(".social__picture");
  const commentText = commentTemplate.querySelector(".social__text");
  const commentAuthor = commentTemplate.querySelector(".social__author");
  commentAvatar.src = comment.avatar;
  commentAvatar.alt = comment.name;
  commentText.textContent = comment.message;
  commentAuthor.textContent = comment.name;
  return commentTemplate;
}
