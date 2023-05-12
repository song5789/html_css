let myImg = document.querySelector("#my-choice");
let comImg = document.querySelector("#com-choice");
let result = document.querySelector("#text-container");
let socket = io.connect();
let reset = document.querySelector("#reset");

let arrRps = [];
arrRps.push(new Rps("가위", 1, "./images/sissors.png"));
arrRps.push(new Rps("바위", 2, "./images/rock.png"));
arrRps.push(new Rps("보", 3, "./images/paper.png"));

let comRps = {
  getTypeValue() {
    return (this.type = getRandomIntInclusive(1, 3));
  },

  getComImgSrc(param) {
    switch (param) {
      case 1:
        return "./images/sissors.png";
      case 2:
        return "./images/rock.png";
      case 3:
        return "./images/paper.png";
    }
  },
};

//dataset.[datasetName] <- 사용자가 부여한 속성의 값을 불러옴
window.onload = function () {
  let myIndex;
  let btnArea = document.querySelector(".button-container");
  btnArea.onclick = function (e) {
    myIndex = e.target.dataset.type - 1;

    let resultChkBtn = document.querySelector("#check-result");
    resultChkBtn.addEventListener("click", () => {
      console.log(myIndex);
      socket.emit("send", arrRps[myIndex].type);

      socket.on("echo", (data) => {
        console.log(data);
        let saveBattleResult = battleResult(arrRps[myIndex].type, data);
        setImgSrc(myImg, arrRps[myIndex].url);
        setImgSrc(comImg, arrRps[data - 1].url);
        result.innerText = saveBattleResult;
        result.style.backgroundColor = changeBgColor(saveBattleResult);
      });
    });
  };
  reset.addEventListener("click", () => {
    socket.emit("reset");
  });
  socket.on("reload", () => {
    location.reload();
  });
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function battleResult(user1, user2) {
  if (user1 == user2) {
    return "무";
  } else if (user2 - user1 == 1 || user2 - user1 == -2) {
    return "패";
  } else {
    return "승리";
  }
}

function setImgSrc(elem, param) {
  elem.src = param;
}

function changeBgColor(param) {
  switch (param) {
    case "승리":
      return "#72acf7";
    case "패":
      return "#fa7aa1";
    default:
      return "#6c6e70";
  }
}

function Rps(name, type, url) {
  this.name = name;
  this.type = type;
  this.url = url;
}
