import { setTimeout } from 'core-js';
import game from './game.js';

const startBtn = document.querySelector('.start-btn');
let snakesTiles = document.querySelectorAll('.snake-tile');
const firstTile = document.querySelector('[data-tile="1"]');
const foodTile = document.querySelector('.food-tile');
const gameBoard = document.querySelector('.game-board');
const gameBoardPosition = {
  top: Math.floor(gameBoard.getBoundingClientRect().top),
  bottom: Math.floor(gameBoard.getBoundingClientRect().bottom),
  left: Math.floor(gameBoard.getBoundingClientRect().left),
  right: Math.floor(gameBoard.getBoundingClientRect().right),
};

// console.log('GAME BOARD POSITION:');
// console.log(gameBoardPosition);
// console.log('---------------------');

export const state = {
  direction: 'up',
  score: 0,
  snakeLength: 6,
};

const setInitialState = function () {
  state.direction = 'top';
  state.score = 0;
  firstTile.style.setProperty('top', `150px`);
  firstTile.style.setProperty('left', `90px`);
  firstTile.style.setProperty('bottom', `135px`);
  firstTile.style.setProperty('right', `205px`);
  foodTile.style.setProperty('top', '90px');
  foodTile.style.setProperty('left', '205px');
};

// const firstTilePosition = {
// 	top: Math.floor(firstTile.getBoundingClientRect().top),
// 	bottom: Math.floor(firstTile.getBoundingClientRect().bottom),
// 	left: Math.floor(firstTile.getBoundingClientRect().left),
// 	right: Math.floor(firstTile.getBoundingClientRect().right),
// };

const startGame = function () {
  // let newDirection;

  // const currentFirstTilePosition = {
  // 	top: game.firstTilePosition.top,
  // 	bottom: game.firstTilePosition.bottom,
  // 	left: game.firstTilePosition.left,
  // 	right: game.firstTilePosition.right
  // };

  // const distanceToBorders = {
  // 	top: Math.abs(gameBoardPosition.top - game.firstTilePosition.top),
  // 	bottom: Math.abs(gameBoardPosition.bottom - game.firstTilePosition.bottom),
  // 	left: Math.abs(gameBoardPosition.left - game.firstTilePosition.left),
  // 	right: Math.abs(gameBoardPosition.right - game.firstTilePosition.right),
  // };

  // console.log(distanceToBorders);

  // const foodPosition = {
  // 	top: Math.floor(foodTile.getBoundingClientRect().top),
  // 	bottom: Math.floor(foodTile.getBoundingClientRect().bottom),
  // 	left: Math.floor(foodTile.getBoundingClientRect().left),
  // 	right: Math.floor(foodTile.getBoundingClientRect().right),
  // };

  // changeDirection();
  setInterval(function () {
    game.moveSnake();

  }, 1000);
  // firstTile.addEventListener('move', (e)=>{console.log(e);})
  game.changeDirection();
};

const init = function () {
  game.createRemainingTiles();
  startBtn.addEventListener('click', startGame);
  // tick();
};
init();
