import 'core-js/stable';
import { state, intervalID, foodTile } from './script';

const firstTile = document.querySelector('[data-tile="1"]');
const gameBoard = document.querySelector('.game-board');

class Game {
  firstTilePosition() {
    return {
      top: Math.floor(firstTile.getBoundingClientRect().top),
      bottom: Math.floor(firstTile.getBoundingClientRect().bottom),
      left: Math.floor(firstTile.getBoundingClientRect().left),
      right: Math.floor(firstTile.getBoundingClientRect().right),
    };
  }

  foodPosition() {
    return {
      top: Math.floor(foodTile.getBoundingClientRect().top),
      bottom: Math.floor(foodTile.getBoundingClientRect().bottom),
      left: Math.floor(foodTile.getBoundingClientRect().left),
      right: Math.floor(foodTile.getBoundingClientRect().right),
    };
  }

  gameBoardPosition = {
    top: Math.floor(gameBoard.getBoundingClientRect().top),
    bottom: Math.floor(gameBoard.getBoundingClientRect().bottom),
    left: Math.floor(gameBoard.getBoundingClientRect().left),
    right: Math.floor(gameBoard.getBoundingClientRect().right),
  };

  distanceToBorders() {
    return {
      top: Math.abs(this.gameBoardPosition.top - this.firstTilePosition().top),
      bottom: Math.abs(
        this.gameBoardPosition.bottom - this.firstTilePosition().bottom
      ),
      left: Math.abs(
        this.gameBoardPosition.left - this.firstTilePosition().left
      ),
      right: Math.abs(
        this.gameBoardPosition.right - this.firstTilePosition().right
      ),
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
    const distance = this.distanceToBorders();
    for (const [_, value] of Object.entries(distance)) {
      if (value <= 1) this.stopGame();
    }
  }

  stopGame() {
    clearInterval(intervalID);
  }
}

export default new Game();
