import Canvas from "canvas";
import helpers from "../helpers/general.js";

export default (options, cb) => {
  /* 
    Based on https://generativeartistry.com/tutorials/circle-packing/
  */
  console.log('packing circles...');

  let width = options.width || 1184,
      height = options.height || 506,
      size = width,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext('2d');
  
  ctx.lineWidth = helpers.getRandomInt(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let circles = [];
  let minRadius = 2;
  let maxRadius = 100;
  let totalCircles = 500;
  
  let createCircleAttempts = 500;

  function doesCircleHaveACollision(circle) {
    for(let i = 0; i < circles.length; i++) {
      let otherCircle = circles[i];
      let a = circle.radius + otherCircle.radius;
      let x = circle.x - otherCircle.x;
      let y = circle.y - otherCircle.y;

      if (a >= Math.sqrt((x*x) + (y*y))) {
        return true;
      }
    }

    if ( circle.x + circle.radius >= width ||
       circle.x - circle.radius <= 0 ) {
      return true;
    }

    if (circle.y + circle.radius >= height ||
        circle.y-circle.radius <= 0 ) {
      return true;
    }

    return false;
  }

  function createAndDrawCircle() {

    let newCircle;
    let circleSafeToDraw = false;
    for( let tries = 0; tries < createCircleAttempts; tries++) {
      newCircle = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        radius: minRadius
      }

      if(doesCircleHaveACollision(newCircle)) {
        continue;
      } else {
        circleSafeToDraw = true;
        break;
      }
    }

    if(!circleSafeToDraw) {
      return;
    }

    for(let radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
      newCircle.radius = radiusSize;
      if(doesCircleHaveACollision(newCircle)){
        newCircle.radius--
        break;
      } 
    }

    circles.push(newCircle);
    ctx.beginPath();
    ctx.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2*Math.PI);
    ctx.stroke(); 
  }

  for( let i = 0; i < totalCircles; i++ ) {  
    createAndDrawCircle();
  }

  if (cb){
    cb(null, {
      data: canvas.toBuffer().toString('base64')
    });
  }
}
