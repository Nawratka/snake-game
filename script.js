// import { setTimeout } from 'core-js';
import game from './game.js';

const startBtn = document.querySelector('.start-btn');
let snakesTiles = document.querySelectorAll('.snake-tile');
const firstTile = document.querySelector('[data-tile="1"]');
export const foodTile = document.querySelector('.food-tile');

// console.log('GAME BOARD POSITION:');
// console.log(gameBoardPosition);
// console.log('---------------------');

export const state = {
  direction: 'up',
  score: 0,
  snakeLength: 6,
};

export let intervalID;

const setInitialState = function () {
  state.direction = 'up';
  state.score = 0;
  firstTile.style.setProperty('top', `150px`);
  firstTile.style.setProperty('left', `90px`);
  firstTile.style.setProperty('bottom', `135px`);
  firstTile.style.setProperty('right', `205px`);
  foodTile.style.setProperty('top', '90px');
  foodTile.style.setProperty('left', '205px');
  intervalID = null;
};

const startGame = function () {



  if (!intervalID) {
    intervalID = setInterval(function () {
      game.moveSnake();
      game.handleReachingBorders();
    }, 500);
  }

  game.changeDirection();
};

const init = function () {
  game.createRemainingTiles();
  startBtn.addEventListener('click', startGame);
};
init();
