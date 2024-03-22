// import { setTimeout } from 'core-js';
import game from './game.js';

export const score = document.querySelector('.score')
const startBtn = document.querySelector('.start-btn');

export const state = {
  direction: 'up',
  score: 0,
  snakeLength: 6
};

export let intervalID;

export const setInitialState = function () {
  const firstTile = document.querySelector('[data-tile="1"]');
  const foodTile = document.querySelector('.food-tile');

  firstTile.style.top = '150px';
  firstTile.style.left = '90px'
  foodTile.style.top = '90px'
  foodTile.style.left = '210px'
  state.direction = 'up';
  state.score = 0;
  state.snakeLength = 6;
  score.textContent = '0000';
  intervalID = null;
};

const startGame = function () {

  if (!intervalID) {
    intervalID = setInterval(function () {
      game.moveSnake();
      game.handleReachingBorders();
      game.collectingFoodHandle();
      game.eatHimself()
    }, 200);
  }

  game.changeDirection();
};

export const init = function () {
  game.createRemainingTiles();
  startBtn.addEventListener('click', startGame);
};
init();
