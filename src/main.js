'use strict';

console.clear();
const colorPositive = '#ffffff';
const colorNegative = '#333333';
const plusSignSize = 120;
class SquareScene {
  constructor (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    window.addEventListener('resize', _ => this.handleResize(), false);      
    this.handleResize();
    requestAnimationFrame(_ => this.draw());
  }
  handleResize () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let {canvas} = this; 
    canvas.width = width;
    canvas.height = height;
  }
  draw (framesElapsed = 0) {
    requestAnimationFrame(_ => this.draw(framesElapsed + 1)); 
    const {canvas, ctx} = this;
    const {width, height} = canvas;
    let angle = framesElapsed * Math.PI / 180;
    let positiveIsDominant = (angle % Math.PI) > (Math.PI / 2);
    ctx.fillStyle = positiveIsDominant ? colorPositive : colorNegative;
    ctx.fillRect(0, 0, width, height);
    const size = plusSignSize;
    const halfSize = size / 2;
    const thirdSize = size / 3
    const twoThirdsSize = thirdSize * 2;
    const maxX = width + thirdSize;
    const maxY = height + thirdSize;
    const drawSign = (x, y, isNegative, index, sy, wasNegativeAtStart) => {
      ctx.save();
      ctx.translate(x, y);
      let draw = false;
      if (isNegative & !positiveIsDominant) {
        ctx.rotate(angle);
        draw = true;
      } 
      if (!isNegative & positiveIsDominant) {
        ctx.rotate(-angle);
        draw = true;
      }
      if (draw) {
        ctx.fillStyle = isNegative ? colorPositive : colorNegative;
        ctx.fillRect(-halfSize, thirdSize - halfSize, size, thirdSize);
        ctx.fillRect(thirdSize - halfSize, - halfSize, thirdSize, size);        
      }
      ctx.restore();
      y += size + twoThirdsSize;
      isNegative = !isNegative;
      if (y > maxY) {
        x += thirdSize;
        y = sy - twoThirdsSize;
        if (Math.abs(y) >= twoThirdsSize * 2) {
          wasNegativeAtStart = !wasNegativeAtStart; 
          isNegative = wasNegativeAtStart;
        }    
        sy = y;
      }
      if (x > maxX) {
        return;
      }
      drawSign(x, y, isNegative, ++index, sy, wasNegativeAtStart);
    };
    drawSign(0 - size, 0, false, 0, 0, false);
  }
}
let canvasEl = document.getElementById('scene');
let scene = new SquareScene(canvasEl);
