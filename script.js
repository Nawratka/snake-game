import 'core-js/stable';
import game from './game.js';

export const score = document.querySelector('.score');
const startBtn = document.querySelector('.start-btn');
const endBox = document.querySelector('.end-box');

export const state = {
  direction: 'up',
  score: 0,
  snakeLength: 6,
};

export let intervalID;
export let scoresArr = [];

export const setInitialState = function () {
  const firstTile = document.querySelector('[data-tile="1"]');
  const foodTile = document.querySelector('.food-tile');

  firstTile.style.top = '150px';
  firstTile.style.left = '90px';
  foodTile.style.top = '90px';
  foodTile.style.left = '210px';
  state.direction = 'up';
  state.score = 0;
  state.snakeLength = 6;
  score.textContent = '0000';
  intervalID = null;
  startBtn.textContent = 'start';
  firstTile.style.setProperty(
    '--first-skin',
    'radial-gradient(circle, rgb(196, 243, 57) 0%, rgba(132,152,97,1) 95%)'
  );

  game.createRemainingTiles();
};

const startGame = function () {
  if (!intervalID) {
    addNaviHandle();
    intervalID = setInterval(function () {
      game.moveSnake();
      game.handleReachingBorders();
      game.collectingFoodHandle();
      game.eatHimself();
      game.skin();
    }, 200);
  }
};

const addNaviHandle = function () {
  window.addEventListener('keydown', keysHandle);
};

export const removeNaviHandle = function () {
  window.removeEventListener('keydown', keysHandle);
};

const keysHandle = function (e) {
  if (
    e.key !== 'ArrowUp' &&
    e.key !== 'ArrowDown' &&
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight'
  ) {
    return;
  } else {
    state.direction = game.directionToGo(e.key);
  }
};

const clickHandle = function () {
  if (!intervalID && endBox.classList.contains('hidden')) {
    startGame();
    startBtn.textContent = 'stop';
    return;
  }
  if (intervalID) {
    game.stopGame();
  }
};

const addClickListener = function () {
  startBtn.addEventListener('click', clickHandle);
};

export const init = function () {
  setInitialState();
  addClickListener();
};
init();
