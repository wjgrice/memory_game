// Images sourced from https://www.pixelstalk.net/hd-8-bit-backgrounds/

const gameContainer = document.getElementById("game");
let gameState = "unPaused";
let timer = 500;
let seconds = 0;
let currentScore = 000000;
let hiScore = 000000;
let tileStartColor = 'rgba(234, 197, 234, 0.35)';

// Set hiScore
updateHiScore();

// Timer to track game length
let clock = setInterval(function() {
  seconds++;
}, 1000);

// Reset the click counter on reload / refresh
localStorage.removeItem('clickCounter')

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// Helper function to shuffle an array
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const tile = document.createElement('div');
    tile.classList.add(color, 'tile');
    tile.setAttribute('matchState', 'no match');

    const front = document.createElement('div');
    front.classList.add('front');

    const back = document.createElement('div');
    back.classList.add('back');

    tile.append(front, back);
    tile.addEventListener('click', handleCardClick);

    gameContainer.append(tile);
  }
}

// Reset game when New Game btn pressed
document.querySelector('.startbtn').addEventListener('click', resetGame);
function resetGame() {
  currentScore = 0;
  seconds = 0;
  localStorage.removeItem('clickCounter');
  document.querySelector('.score').innerText = "Score: 000000";

  gameContainer.innerHTML = '';
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}

function handleCardClick(event) {
  let target = event.target.closest('.tile');
  if (!target || target.classList.contains('flip')) return;

  let matchState = target.getAttribute('matchState');
  let color = target.className.split(" ")[0];

  if (gameState === 'unPaused' && matchState === 'no match') {
    let currentFlip = flipNum();

    if (currentFlip === '1st') {
      target.classList.add('flip');
      target.querySelector('.front').style.backgroundColor = color;
      prevTarget = target;
    } else if (currentFlip === '2nd') {
      target.classList.add('flip');
      target.querySelector('.front').style.backgroundColor = color;

      if (target.querySelector('.front').style.backgroundColor === prevTarget.querySelector('.front').style.backgroundColor) {
        target.setAttribute('matchState', 'matched');
        prevTarget.setAttribute('matchState', 'matched');
        score();
        updateHiScore();
        checkWinCondition(); // Check if all tiles are matched
      } else {
        setTimeout(() => {
          target.classList.remove('flip');
          prevTarget.classList.remove('flip');
        }, timer);
        gameState = 'paused';
        delay(timer).then(() => (gameState = 'unPaused'));
      }
    }
  }
}

function checkWinCondition() {
  const unmatchedTiles = document.querySelectorAll('.tile[matchState="no match"]');
  if (unmatchedTiles.length === 0) {
    celebrate();
  }
}

function celebrate() {
  const confettiContainer = document.createElement('div');
  confettiContainer.classList.add('confetti-container');
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.remove();
  }, 5000);
}

function updateHiScore() {
  if (localStorage.getItem('hiScore') === null) {
    localStorage.setItem('hiScore', currentScore);
  } else if (localStorage.getItem('hiScore') < currentScore) {
    localStorage.setItem('hiScore', currentScore);
  }
  let storedScore = localStorage.getItem('hiScore');
  document.querySelector('.hi-score').innerText = "High Score: " + storedScore;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function score() {
  if (seconds <= 20) {
    currentScore += seconds * 1000 * 3.14;
  } else if (seconds <= 40) {
    currentScore += seconds * 500 * 3.14;
  } else if (seconds <= 60) {
    currentScore += seconds * 250 * 3.14;
  } else {
    currentScore += seconds * 100 * 3.14;
  }
  let scoreBoard = document.querySelector('.score');
  scoreBoard.innerText = "Score: " + currentScore;
}

function flipNum() {
  if (localStorage.getItem('clickCounter') === null) {
    localStorage.setItem('clickCounter', '1st');
  } else if (localStorage.getItem('clickCounter') === "1st") {
    localStorage.setItem('clickCounter', '2nd');
  } else if (localStorage.getItem('clickCounter') === "2nd") {
    localStorage.setItem('clickCounter', '1st');
  }
  let counter = localStorage.getItem('clickCounter');
  return counter;
}

// when the DOM loads
createDivsForColors(shuffledColors);
