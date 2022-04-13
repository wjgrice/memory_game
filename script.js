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
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// Loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {

    // create a new div
    const newDiv = document.createElement("div");
    newDiv.style.backgroundColor = tileStartColor;

    // give it a class attribute for the value we are looping over and to query select latter
    newDiv.classList.add(color);
    newDiv.classList.add("tile")

    // give it a two custom attributes to indicate flipped status and if it's matched or not
    newDiv.setAttribute('matchState', 'no match');    

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// Reset game when New Game btn pressed
document.querySelector('.startbtn').addEventListener('click', resetGame);
function resetGame() {
  currentScore = 000000;
  gameTiles = document.querySelector('.tile-container').children;
  for (let i = 0; i < gameTiles.length; i++) {
    gameTiles[i].style.backgroundColor = tileStartColor;
    gameTiles[i].setAttribute('matchState', 'no match'); 
  }
}


// TODO: Implement this function!
function handleCardClick(event) {
  let target = event.target;
  let classes = target.className.split(" ");
  let color = classes[0];
  let matchState = target.getAttribute('matchState');

  if (gameState === 'unPaused') {  // Check if game is paused
    let currentFlip = flipNum(); // check if this click is the 1st or 2nd click
    if (currentFlip === '1st' && matchState === 'no match'){ //Is this the 1st click and does the tile have a "match tag"
      target.style.backgroundColor = color; // show tile by changing color
      target.style.opacity = '100%';
      prevTarget = target; // setup process for tracking previous clicks
    }
    if (currentFlip === '2nd' && matchState === 'no match') { // Check if 2nd flip and not a previously match tile
      target.style.backgroundColor = color; // show tile by changing color
      target.style.opacity = '100%';
      if (target.style.backgroundColor === prevTarget.style.backgroundColor) { // Check is current tile and prev tile match by color
        target.setAttribute('matchState', 'matched'); // set current and prev tiles match states.
        prevTarget.setAttribute('matchState', 'matched');
        score(); // Up current score
        updateHiScore();
      }
      else {  // no match... flip the two tiles back over by deleting background color and pause for length of timer variable
        setTimeout(function() {
          target.style.backgroundColor = tileStartColor;
          prevTarget.style.backgroundColor = tileStartColor;
        }, timer);
        gameState = 'paused'
        delay(timer).then(() => gameState = 'unPaused');  //magic
      }
    }
  }
} //Func

// Start/reset game
function updateHiScore() {
  if (localStorage.getItem('hiScore') === null) {
    localStorage.setItem('hiScore', currentScore)
  }
  else if (localStorage.getItem('hiScore') < currentScore) {
    localStorage.setItem('hiScore', currentScore)
  }
  let storedScore = localStorage.getItem('hiScore');
  document.querySelector('.hi-score').innerText = "High Score: " + storedScore;
}


// Do no completely understand this code but I needed a timer to pause the game.  
// Borrowed from: https://masteringjs.io/tutorials/fundamentals/wait-1-second-then
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function score() {
  if (seconds <= 20) {
    currentScore += seconds*1000*3.14;
  }
  else if (seconds <= 40) {
    currentScore += seconds*500*3.14;
  }
  else if (seconds <= 60) {
    currentScore += seconds*250*3.14;
  }
  else {
    currentScore += seconds*100*3.14;
  }
  let scoreBoard = document.querySelector('.score');
  scoreBoard.innerText = "Score: " + currentScore;
}


//Simple counter using local storage returns 0 or 1.
function flipNum() {
  if (localStorage.getItem('clickCounter') === null) {
    localStorage.setItem('clickCounter', '1st')
  }
  else if (localStorage.getItem('clickCounter') === "1st") {
    localStorage.setItem('clickCounter', '2nd')
  }
  else if (localStorage.getItem('clickCounter') === "2nd") {
    localStorage.setItem('clickCounter', '1st')
  }
  let counter = localStorage.getItem('clickCounter');
  return (counter)
}

// when the DOM loads
createDivsForColors(shuffledColors);
