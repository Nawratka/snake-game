import { state } from './script';

const firstTile = document.querySelector('[data-tile="1"]');

class Game {
  firstTilePosition = {
    top: Math.floor(firstTile.getBoundingClientRect().top),
    bottom: Math.floor(firstTile.getBoundingClientRect().bottom),
    left: Math.floor(firstTile.getBoundingClientRect().left),
    right: Math.floor(firstTile.getBoundingClientRect().right),
  };

  moveSnake() {
    if (state.direction === 'left') this.goLeft();
    if (state.direction === 'up') this.goUp();
    if (state.direction === 'right') this.goRight();
    if (state.direction === 'bottom') this.goDown();
  }

  goUp() {
    const newUp =
      Number(window.getComputedStyle(firstTile).getPropertyValue('top').slice(0, -2)) -
      15;
    firstTile.style.setProperty('top', `${newUp}px`);
  }

  goDown() {
    console.log('hkhk');
    const newDown =
      Number(window.getComputedStyle(firstTile).getPropertyValue('top').slice(0, -2)) + 15;
    firstTile.style.setProperty('top', `${newDown}px`);
  }

  goLeft() {
    const newLeft =
      Number(window.getComputedStyle(firstTile).getPropertyValue('left').slice(0, -2)) -
      15;
    firstTile.style.setProperty('left', `${newLeft}px`);
  }

  goRight() {
    const newRight =
      Number(window.getComputedStyle(firstTile).getPropertyValue('left').slice(0, -2)) +
      15;
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


}

export default new Game();
