"use strict";

const fs = require("fs");
const pathToPhotoDirectory = "photos";
const pathToAvatarDirectory = "img";

function countFilesInDirectory(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.length;
  } catch (error) {
    console.error(`Ошибка при чтении директории: ${error.message}`);
  }
}

function countAvatarFilesInDirectory(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    const avatarFiles = files.filter((file) => /^avatar-\d+\.svg$/.test(file));
    return avatarFiles.length;
  } catch (error) {
    console.error(`Ошибка при подсчете файлов: ${error.message}`);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSortArray() {
  return Math.random() - 0.5;
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
    const url = `https://hipsum.co/api/?type=hipster-latin&sentences=${countFilesInDirectory(
      pathToPhotoDirectory
    )}`;
    const response = await requestData(url);
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
    const url = `https://randommer.io/api/Name?nameType=firstname&quantity=${quantity}`;
    const apiKey = "8d01faaf165e413084411b74a0b88829";
    const response = await requestData(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });
    const names = await parseReceivedDataIntoJSON(response);
    return names;
  } catch (error) {
    console.error(`Ошибка при запросе имен для комментариев: ${error.message}`);
  }
}

// Основная функция
async function createPhotoDescriptions() {
  try {
    const commentators = await requestNamesForComments(
      `${countFilesInDirectory(pathToPhotoDirectory)}`
    );
    const descriptions = await requestDescriptionsForPhotos();
    const comments = getСommentsForPhotos();
    const photoDescriptions = new Array(
      countFilesInDirectory(pathToPhotoDirectory)
    )
      .fill(null)
      .map((_, index) => {
        const commentsIdentifiers = new Set();

        return {
          id: index + 1,
          url: `${pathToPhotoDirectory}/${index + 1}.jpg`,
          description: descriptions[index],
          likes: getRandomNumber(15, 200),
          comments: new Array(getRandomNumber(10, 25))
            .fill(null)
            .map((_, index) => {
              let commentId;
              const sortedCommentators = commentators.sort(randomSortArray);

              do {
                commentId = getRandomNumber(25, 150);
              } while (commentsIdentifiers.has(commentId));

              commentsIdentifiers.add(commentId);
              return {
                id: commentId,
                avatar: `${pathToAvatarDirectory}/avatar-${getRandomNumber(
                  1,
                  countAvatarFilesInDirectory(pathToAvatarDirectory)
                )}.svg`,
                message: comments[getRandomNumber(0, comments.length - 1)],
                name: sortedCommentators[index],
              };
            }),
        };
      });

    return photoDescriptions;
  } catch (error) {
    console.error(`Ошибка при создании описаний фотографий: ${error.message}`);
  }
}

createPhotoDescriptions()
  .then((data) => console.dir(data, { depth: null }))
  .catch((error) => {
    console.error(
      `Ошибка при выполнении createPhotoDescriptions: ${error.message}`
    );
  });
