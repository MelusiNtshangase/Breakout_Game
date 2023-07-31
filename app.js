"use strict";
const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
const blockWidth = 100;
const blockHeight = 20;

const userStart = [230, 10];
let currentPostion = userStart;

const ballStart = [270, 40];
let currentBallPostion = ballStart;
let timerID;
let score = 0;

let xyDirection = [-2, 2];

// Create block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]; // This is the starting point 4 the block
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];
console.log(blocks[0]);

// Draw all blocks
const addBlock = function () {
  for (let i = 0; i < blocks.length; i++) {
    const blockEl = document.createElement("div");
    blockEl.classList.add("block");
    blockEl.style.left = blocks[i].bottomLeft[0] + "px";
    blockEl.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(blockEl);
  }
};
addBlock();

// Draw user
const drawUser = function () {
  user.style.left = currentPostion[0] + "px";
  user.style.bottom = currentPostion[1] + "px";
};

// Draw Ball
const drawBall = function () {
  ball.style.left = currentBallPostion[0] + "px";
  ball.style.bottom = currentBallPostion[1] + "px";
};

// add user
const user = document.createElement("div");
user.classList.add("user");
drawUser();
grid.appendChild(user);

const moveUser = function (e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPostion[0] > 0) {
        currentPostion[0] -= 10;
        drawUser();
      }
      break;

    case "ArrowRight":
      if (currentPostion[0] < boardWidth - blockWidth) {
        currentPostion[0] += 10;
        drawUser();
      }
      break;
  }
};
document.addEventListener("keydown", moveUser);

// add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

//  move ball
const moveBall = function () {
  currentBallPostion[0] += xyDirection[0];
  currentBallPostion[1] += xyDirection[1];
  drawBall();
  checkForCollisions();
};

timerID = setInterval(moveBall, 20);

const changeDirection = function () {
  // Going Diagonally Up Right (/)
  if (xyDirection[0] === 2 && xyDirection[1] === 2) {
    xyDirection[1] = -2;
    return;
  }

  // Going Diagonally Up Left (\)
  if (xyDirection[0] === -2 && xyDirection[1] === 2) {
    xyDirection[0] = 2;
    return;
  }

  // Going Diagonally Down Right (\)
  if (xyDirection[0] === 2 && xyDirection[1] === -2) {
    xyDirection[0] = -2;
    return;
  }

  // Going Diagonally Down Left (/)
  if (xyDirection[0] === -2 && xyDirection[1] === -2) {
    xyDirection[1] = 2;
    return;
  }
};

function checkForCollisions() {
  // Check for block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      currentBallPostion[0] > blocks[i].bottomLeft[0] &&
      currentBallPostion[0] < blocks[i].bottomRight[0] &&
      currentBallPostion[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      currentBallPostion[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1); // Removes block
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      // Check for WIN
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "You WIN!!! 🎉🎉🎉";
        clearInterval(timerID);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  // Check for wall collisions
  if (
    currentBallPostion[0] >= boardWidth - ballDiameter ||
    currentBallPostion[1] >= boardHeight - ballDiameter ||
    currentBallPostion[0] <= 0
  )
    changeDirection();

  // Check for user collisions
  if (
    currentBallPostion[0] > currentPostion[0] &&
    currentBallPostion[0] < currentPostion[0] + blockWidth &&
    currentBallPostion[1] > currentPostion[1] &&
    currentBallPostion[1] < currentPostion[1] + blockHeight
  )
    changeDirection();

  if (currentBallPostion[1] <= 0) {
    // Check for Game Over
    clearInterval(timerID);
    scoreDisplay.innerHTML = "You Lose!!! 😢😢";
    document.removeEventListener("keydown", moveUser);
  }
}
