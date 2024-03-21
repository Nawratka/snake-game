import 'core-js/stable';
import { state, intervalID } from './script';

const firstTile = document.querySelector('[data-tile="1"]');
const gameBoard = document.querySelector('.game-board');
const score = document.querySelector('.score');
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
  // distanceToElement(element) {
  //   return {
  //     top: element.top - this.firstTilePosition().top,
  //     bottom: element.bottom - this.firstTilePosition().bottom,
  //     left: element.left - this.firstTilePosition().left,
  //     right: element.right - this.firstTilePosition().right,
  //   };
  // }

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
    snakesTiles.forEach((tile, index) => {
      if (tile.dataset.tile === '1') return;
      const { top, left } = coords[index - 1];

      tile.style.setProperty('top', `${top}px`);
      tile.style.setProperty('left', `${left}px`);
    });
  }

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
      if (
        !e.keyCode === 37 ||
        !e.keyCode === 38 ||
        !e.keyCode === 39 ||
        !e.keyCode === 40
      )
        return;

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
    const distance = this.distanceToElement(this.gameBoardPosition);
    for (const [direction, value] of Object.entries(distance)) {
      if (
        (state.direction === 'up' && direction === 'top' && value === 15) ||
        (state.direction === 'bottom' &&
          direction === 'bottom' &&
          value === -15) ||
        (state.direction === 'left' && direction === 'left' && value === 15) ||
        (state.direction === 'right' && direction === 'right' && value === -15)
      )
        this.stopGame();
    }
  }

  stopGame() {
    clearInterval(intervalID);
  }

  collectingFoodHandle() {
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
    foodTile = document.createElement('div');
    foodTile.classList.add('food-tile', 'tile');
    let top = this.getRandomInt(boardWidth);
    foodTile.style.setProperty('top', `${top}px`);
    let left = this.getRandomInt(boardWidth);
    foodTile.style.setProperty('left', `${left}px`);
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
}

export default new Game();
