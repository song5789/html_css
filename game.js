let myImg = document.querySelector("#my-choice");
let comImg = document.querySelector("#com-choice");
let result = document.querySelector("#text-container");

let arrRps = [];
arrRps.push(new Rps("가위", 1, "/images/sissors.png"));
arrRps.push(new Rps("바위", 2, "/images/rock.png"));
arrRps.push(new Rps("보", 3, "/images/paper.png"));

let comRps = {
  getTypeValue() {
    return (this.type = getRandomIntInclusive(1, 3));
  },

  getComImgSrc(param) {
    switch (param) {
      case 1:
        return "/images/sissors.png";
      case 2:
        return "/images/rock.png";
      case 3:
        return "/images/paper.png";
    }
  },
};

//dataset.[datasetName] <- 사용자가 부여한 속성의 값을 불러옴
window.onload = function () {
  let btnArea = document.querySelector(".button-container");
  btnArea.onclick = function (e) {
    let index = e.target.dataset.type - 1;
    let saveBattleResult = battleResult(
      arrRps[index].type,
      comRps.getTypeValue()
    );
    setImgSrc(myImg, arrRps[index].url);
    setImgSrc(comImg, comRps.getComImgSrc(comRps.type));
    result.innerText = saveBattleResult;
    result.style.backgroundColor = changeBgColor(saveBattleResult);
  };
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
