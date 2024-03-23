import 'core-js/stable';
import { state, intervalID, score, setInitialState } from './script';

const firstTile = document.querySelector('[data-tile="1"]');
const gameBoard = document.querySelector('.game-board');
const endBox = document.querySelector('.end-box');
const displayEndScore = document.querySelector('.display-score');
const closeBtn = document.querySelector('.close-btn');
const boardWidth = +window.getComputedStyle(gameBoard).width.slice(0, -2);
let foodTile = document.querySelector('.food-tile');

class Game {
  gameBoardPosition = {
    top: Math.floor(gameBoard.getBoundingClientRect().top),
    bottom: Math.floor(gameBoard.getBoundingClientRect().bottom),
    left: Math.floor(gameBoard.getBoundingClientRect().left),
    right: Math.floor(gameBoard.getBoundingClientRect().right),
  };

  positionOfElement(element) {
    return {
      top: Math.floor(element.getBoundingClientRect().top),
      bottom: Math.floor(element.getBoundingClientRect().bottom),
      left: Math.floor(element.getBoundingClientRect().left),
      right: Math.floor(element.getBoundingClientRect().right),
    };
  }

  distanceToElement(element) {
    return {
      top: element.top - this.positionOfElement(firstTile).top,
      bottom: element.bottom - this.positionOfElement(firstTile).bottom,
      left: element.left - this.positionOfElement(firstTile).left,
      right: element.right - this.positionOfElement(firstTile).right,
    };
  }

  createRemainingTiles() {
    for (let i = 2; i <= state.snakeLength; i++) {
      let tempTile = document.querySelector(`[data-tile="${i - 1}"]`);
      const markup = ` <div class="snake-tile tile" data-tile="${i}"></div>`;
      const newTop =
        Number(
          window.getComputedStyle(tempTile).getPropertyValue('top').slice(0, -2)
        ) + 15;
      const newLeft = Number(
        window.getComputedStyle(tempTile).getPropertyValue('left').slice(0, -2)
      );

      tempTile.insertAdjacentHTML('afterend', markup);
      const newTile = document.querySelector(`[data-tile="${i}"]`);
      newTile.style.setProperty('top', `${newTop}px`);
      newTile.style.setProperty('left', `${newLeft}px`);
    }
  }

  moveSnake() {
    let snakesTiles = document.querySelectorAll('.snake-tile');
    // ARRAY WITH COORDS OD EACH SNAKE'S TILE
    let coords = [];
    snakesTiles.forEach(tile => {
      coords.push({
        top: Number(tile.style.top.slice(0, -2)),
        left: Number(tile.style.left.slice(0, -2)),
      });
    });

    this.moveRemainingTiles(snakesTiles, coords);

    if (state.direction === 'left') this.goLeft();
    if (state.direction === 'up') this.goUp();
    if (state.direction === 'right') this.goRight();
    if (state.direction === 'bottom') this.goDown();
  }

  moveRemainingTiles(snakesTiles, coords) {
    // MOVE EACH SNAKE'S TILE TO POSITION OF PREVIOUS TILE BASED ON COORDINATES ARRAY TOOK ON EACH TIME TICK
    snakesTiles.forEach((tile, index) => {
      if (tile.dataset.tile === '1') return;
      const { top, left } = coords[index - 1];

      tile.style.setProperty('top', `${top}px`);
      tile.style.setProperty('left', `${left}px`);
    });
  }

  // ALL DIRECTION FUNCTIONS ADD VALUE 15 TO CURRENT POSITION OF FIRST TILE, BASED ON GENERAL DIRECTION DECLARED IN STATE.DIRECTION (WHICH IS CHANGED WHILE KEYDOWN LISTENING SEE: changeDirection() FUNCTION)

  goUp() {
    const newUp =
      Number(
        window.getComputedStyle(firstTile).getPropertyValue('top').slice(0, -2)
      ) - 15;

    firstTile.style.setProperty('top', `${newUp}px`);
  }

  goDown() {
    const newDown =
      Number(
        window.getComputedStyle(firstTile).getPropertyValue('top').slice(0, -2)
      ) + 15;
    firstTile.style.setProperty('top', `${newDown}px`);
  }

  goLeft() {
    const newLeft =
      Number(
        window.getComputedStyle(firstTile).getPropertyValue('left').slice(0, -2)
      ) - 15;
    firstTile.style.setProperty('left', `${newLeft}px`);
  }

  goRight() {
    const newRight =
      Number(
        window.getComputedStyle(firstTile).getPropertyValue('left').slice(0, -2)
      ) + 15;
    firstTile.style.setProperty('left', `${newRight}px`);
  }

  changeDirection() {
    window.addEventListener('keydown', e => {
      // KEY OTHER THAN ARROW KEYS
      if (
        !e.keyCode === 37 ||
        !e.keyCode === 38 ||
        !e.keyCode === 39 ||
        !e.keyCode === 40
      )
        return;

      // CAN'T CHOICE OPPOSITE DIRECTION
      if (state.direction === 'up' && e.keyCode === 40) return;
      if (state.direction === 'bottom' && e.keyCode === 38) return;
      if (state.direction === 'left' && e.keyCode === 39) return;
      if (state.direction === 'right' && e.keyCode === 37) return;

      // CHANGE DIRECTION
      state.direction = this.directionToGo(e.keyCode);
    });
  }

  directionToGo = function (keycode) {
    if (keycode === 37) return 'left';
    if (keycode === 38) return 'up';
    if (keycode === 39) return 'right';
    if (keycode === 40) return 'bottom';
  };

  handleReachingBorders() {
    // CHECK IF FIRST TILE IS OUT OF BORDER
    const distance = this.distanceToElement(this.gameBoardPosition);
    for (const [direction, value] of Object.entries(distance)) {
      if (
        (state.direction === 'up' && direction === 'top' && value >= 14) ||
        (state.direction === 'bottom' &&
          direction === 'bottom' &&
          value <= -14) ||
        (state.direction === 'left' && direction === 'left' && value >= 14) ||
        (state.direction === 'right' && direction === 'right' && value <= -14)
      )
        this.stopGame();
    }
  }

  stopGame() {
    // WHEN REACHING BORDERS OR EATING HIMSELF

    const snake = Array.from(document.querySelectorAll('.snake-tile'));

    // STOP TICKING
    clearInterval(intervalID);
    // SHOW END VIEW AND SCORE
    endBox.classList.remove('hidden');
    displayEndScore.textContent = state.score;

    function closeEndView(e) {
      if (e.target !== closeBtn) return;
      endBox.classList.add('hidden');
      for (let i = 1; i < snake.length; i++) {
        gameBoard.removeChild(snake[i]);
      }
      setInitialState();

      closeBtn.removeEventListener('click', closeEndView);
    }

    closeBtn.addEventListener('click', closeEndView);
  }

  collectingFoodHandle() {
    // CHECK IF FIRST TILE'S POSITION === FOOD TILES
    if (
      this.positionOfElement(foodTile).top ===
        this.positionOfElement(firstTile).top &&
      this.positionOfElement(foodTile).left ===
        this.positionOfElement(firstTile).left
    ) {
      state.score += 10;
      const scoreStr = String(state.score);
      score.textContent = scoreStr.padStart(4, '0');
      this.removeEatenTile();
      this.extendSnake();
      this.createFoodTile();
    }
  }

  removeEatenTile() {
    gameBoard.removeChild(foodTile);
  }

  createFoodTile() {
    // GETS SNAKE'S TILES POSITIONS AND GENERATE FOOD TILE OUT OF SNAKE'S BODY

    // ARRAY WITH [TOP, LEFT] OF EACH SNAKE'S TILES
    const snakesTilesPosition = [];
    let snakesTiles = document.querySelectorAll('.snake-tile');
    snakesTiles.forEach(tile =>
      snakesTilesPosition.push([tile.style.top, tile.style.left])
    );

    foodTile = document.createElement('div');
    foodTile.classList.add('food-tile', 'tile');

    // GENERATE POSITION TOP
    let top = this.getRandomInt(boardWidth);
    // AVOID FOOD ON SNAKE - TOP
    snakesTilesPosition.forEach(tile => {
      while (+tile[0].slice(0, -2) === top) {
        top = this.getRandomInt(boardWidth);
      }
    });
    // SET TOP VALUE
    foodTile.style.setProperty('top', `${top}px`);

    // GENERATE POSITION LEFT
    let left = this.getRandomInt(boardWidth);
    // AVOID FOOD ON SNAKE - LEFT
    snakesTilesPosition.forEach(tile => {
      while (+tile[1].slice(0, -2) === left) {
        left = this.getRandomInt(boardWidth);
      }
    });
    // SET LEFT VALUE
    foodTile.style.setProperty('left', `${left}px`);

    // ADD NEW FOOD TILE TO GAME BOARD
    gameBoard.appendChild(foodTile);
  }

  getRandomInt(max) {
    let tempNumber;
    while (tempNumber % 15 !== 0) {
      tempNumber = Math.floor(Math.random() * max);
    }
    return tempNumber;
  }

  extendSnake() {
    // ADD NEW TILE AFTER SNAKE'S LAST TILE
    const currentTiles = document.querySelectorAll('.snake-tile');

    let lastTile = document.querySelector(
      `[data-tile="${currentTiles.length}"]`
    );
    const markup = ` <div class="snake-tile tile" data-tile="${
      currentTiles.length + 1
    }"></div>`;
    const newTop =
      Number(
        window.getComputedStyle(lastTile).getPropertyValue('top').slice(0, -2)
      ) + 15;
    const newLeft = Number(
      window.getComputedStyle(lastTile).getPropertyValue('left').slice(0, -2)
    );

    lastTile.insertAdjacentHTML('afterend', markup);
    const newTile = document.querySelector(
      `[data-tile="${currentTiles.length + 1}"]`
    );
    newTile.style.setProperty('top', `${newTop}px`);
    newTile.style.setProperty('left', `${newLeft}px`);
  }

  eatHimself() {
    // CHECK IF FIRST TILE GOT SAME POSITION 'TOP' AND 'LEFT' LIKE ONE OF ITSELF'S TILES
    const snakesTiles = document.querySelectorAll('.snake-tile');
    snakesTiles.forEach((tile, index) => {
      if (index <= 3) return;

      if (
        tile.style.top === firstTile.style.top &&
        tile.style.left === firstTile.style.left
      )
        this.stopGame();
    });
  }
}

export default new Game();
