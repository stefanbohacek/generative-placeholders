import Canvas from "canvas";
import helpers from "../helpers/general.js";

export default (options, cb) => {
  /* 
    Based on https://generativeartistry.com/tutorials/piet-mondrian/
  */
  console.log('packing circles...');

  let width = options.width || 1184,
      height = options.height || 506,
      size = width,
      colors = options.colors || ['#D40920', '#1356A2', '#F7D842'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext('2d');
  
  ctx.lineWidth = helpers.getRandomInt(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let squares = [{
    x: 0,
    y: 0,
    width: width,
    height: height
  }];

  canvas.width = width;
  canvas.height = height;
  ctx.lineWidth = 8;

  let step = size / 7;
  let white = '#F2F5F1';

  function splitSquaresWith(coordinates) {
    const { x, y } = coordinates;

    for (let i = squares.length - 1; i >= 0; i--) {
    const square = squares[i];

    if (x && x > square.x && x < square.x + square.width) {
        if(Math.random() > 0.5) {
          squares.splice(i, 1);
          splitOnX(square, x); 
        }
    }

    if (y && y > square.y && y < square.y + square.height) {
        if(Math.random() > 0.5) {
          squares.splice(i, 1);
          splitOnY(square, y); 
        }
    }
    }
  }

  function splitOnX(square, splitAt) {
    let squareA = {
      x: square.x,
      y: square.y,
      width: square.width - (square.width - splitAt + square.x),
      height: square.height
    };

    let squareB = {
    x: splitAt,
    y: square.y,
    width: square.width - splitAt + square.x,
    height: square.height
    };

    squares.push(squareA);
    squares.push(squareB);
  }

  function splitOnY(square, splitAt) {
    let squareA = {
      x: square.x,
      y: square.y,
      width: square.width,
      height: square.height - (square.height - splitAt + square.y)
    };

    let squareB = {
    x: square.x,
    y: splitAt,
    width: square.width,
    height: square.height - splitAt + square.y
    };

    squares.push(squareA);
    squares.push(squareB);
  }


  for (let i = 0; i < size; i += step) {
    splitSquaresWith({ y: i });
    splitSquaresWith({ x: i });
  }

  for (let i = 0; i < colors.length; i++) {
    squares[Math.floor(Math.random() * squares.length)].color = colors[i];
  }
  for (let i = 0; i < squares.length; i++) {
    ctx.beginPath();
    ctx.rect(
      squares[i].x,
      squares[i].y,
      squares[i].width,
      squares[i].height
    );
    if(squares[i].color) {
      ctx.fillStyle = squares[i].color;
    } else {
      ctx.fillStyle = white
    }
    ctx.fill()
    ctx.stroke();
  }

  if (cb){
    cb(null, {
      data: canvas.toBuffer().toString('base64')
    });
  }
}
