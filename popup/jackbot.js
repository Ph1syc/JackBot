function getRandomRoomId(idLength) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < idLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function checkIfRoomIsFree(roomId) {
  const url = `https://ecast.jackboxgames.com/api/v2/rooms/${roomId}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.ok;
  } catch (err) {
    console.log(err);
    throw new Error("CORS error occurred.");
  }
}

var delay = 1500;

async function findRoom() {
  const NUMBER_OF_RETRIES = 20;
  let freeRoomId = null;
  let count = 1;
  while (!freeRoomId && count <= NUMBER_OF_RETRIES) {
    const id = getRandomRoomId(4);
    const isFree = await checkIfRoomIsFree(id);
    if (isFree) {
      freeRoomId = id;
    } else {
      setTimeout(function() {
        count++;
      }, delay);
    }
  }
  return freeRoomId;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("checkButton").addEventListener("click", async function () {
    const codeBox = document.getElementById("codeBox");
    codeBox.value = "Checking...";

    try {
      const freeRoomId = await findRoom();
      if (freeRoomId) {
        codeBox.value = freeRoomId;
      } else {
        codeBox.value = "No codes found, Retry.";
      }
    } catch (err) {
      if (err.message === "CORS error occurred.") {
        codeBox.value = "Rate limit reached, retry in 5 minutes.";
      } else {
        console.log(err);
        codeBox.value = "An error occurred.";
      }
    }
  });
});