"use strict";

import { displayAllPhotos } from "./rendering-images.js";
import { activateFullSizePhotoMode } from "./full-size-images.js";

const numberOfUserPhotos = 25;
const numberOfUserAvatars = 6;
const minСommentID = 1;
const maxСommentID = 1000;
const minNumberOfLikes = 15;
const maxNumberOfLikes = 200;
const minNumberOfComments = 10;
const maxNumberOfComments = 25;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sortRandomlyArray() {
  return Math.random() - 0.5;
}

function getRandomCommentId(commentsIdentifiers) {
  let commentId = null;

  do {
    commentId = getRandomNumber(minСommentID, maxСommentID);
  } while (commentsIdentifiers.has(commentId));

  commentsIdentifiers.add(commentId);
  return commentId;
}

async function requestData(url, params = null) {
  try {
    let response;

    if (params === null) {
      response = await fetch(url);
    } else {
      response = await fetch(url, params);
    }

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении запроса: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Произошла ошибка:", error.message);
  }
}

async function parseReceivedDataIntoJSON(data) {
  try {
    const dataJSON = await data.json();
    return dataJSON;
  } catch (error) {
    console.error(`Ошибка при парсинге данных в формат JSON: ${error.message}`);
  }
}

function getСommentsForPhotos() {
  return [
    "Все відмінно!",
    "Загалом все непогано. Але не всі.",
    "Коли ви робите фотографію, добре б прибирати палець із кадру. Зрештою, це просто непрофесійно.",
    "Моя бабуся випадково чхнула з фотоапаратом у руках і у неї вийшла фотографія краща.",
    "Я послизнувся на банановій шкірці і впустив фотоапарат на кота і у мене вийшла фотографія краще.",
    "Обличчя людей на фотці перекошені, ніби їх побивають. Як можна було зловити такий невдалий момент?",
  ];
}

async function requestDescriptionsForPhotos() {
  try {
    const hipsumURL = `https://hipsum.co/api/?type=hipster-latin&sentences=${numberOfUserPhotos}`;
    const response = await requestData(hipsumURL);
    const descriptions = await parseReceivedDataIntoJSON(response);
    const highlightedDescriptions = descriptions[0]
      .split(". ")
      .map((description, index, descriptionsArray) => {
        const isLastElement = index === descriptionsArray.length - 1;

        if (!isLastElement) {
          return (description += ".");
        }

        return description;
      });
    return highlightedDescriptions;
  } catch (error) {
    console.error(
      `Ошибка при запросе описаний для фотографий: ${error.message}`
    );
  }
}

async function requestNamesForComments(quantity) {
  try {
    const randommerURL = `https://randommer.io/api/Name?nameType=firstname&quantity=${quantity}`;
    const randommerAPIKey = "8d01faaf165e413084411b74a0b88829";
    const response = await requestData(randommerURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": randommerAPIKey,
      },
    });
    const names = await parseReceivedDataIntoJSON(response);
    return names;
  } catch (error) {
    console.error(`Ошибка при запросе имен для комментариев: ${error.message}`);
  }
}

function generateComments(quantity, comments, commentators, commentsId) {
  return new Array(quantity).fill().map((_, index) => {
    return {
      id: getRandomCommentId(commentsId),
      avatar: `img/avatar-${getRandomNumber(1, numberOfUserAvatars)}.svg`,
      message: comments[getRandomNumber(0, comments.length - 1)],
      name: commentators[index],
    };
  });
}

function createPhotoDescription(index, descriptions, commentators, comments) {
  const sortedCommentators = commentators.sort(sortRandomlyArray);
  const commentsIdentifiers = new Set();
  return {
    id: index + 1,
    url: `photos/${index + 1}.jpg`,
    description: descriptions[index],
    likes: getRandomNumber(minNumberOfLikes, maxNumberOfLikes),
    comments: generateComments(
      getRandomNumber(minNumberOfComments, maxNumberOfComments),
      comments,
      sortedCommentators,
      commentsIdentifiers
    ),
  };
}

async function createPhotoDescriptions() {
  try {
    const commentators = await requestNamesForComments(numberOfUserPhotos);
    const descriptions = await requestDescriptionsForPhotos();
    const comments = getСommentsForPhotos();
    const photoDescriptions = new Array(numberOfUserPhotos)
      .fill()
      .map((_, index) => {
        return createPhotoDescription(
          index,
          descriptions,
          commentators,
          comments
        );
      });
    return photoDescriptions;
  } catch (error) {
    console.error(`Ошибка при создании описаний фотографий: ${error.message}`);
  }
}

createPhotoDescriptions()
  .then((photoDescriptions) => {
    displayAllPhotos(photoDescriptions);
    activateFullSizePhotoMode(photoDescriptions);
  })
  .catch((error) =>
    console.error(
      `Ошибка при выполнении createPhotoDescriptions: ${error.message}`
    )
  );
