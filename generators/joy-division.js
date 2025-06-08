import fs from "fs";
import Canvas from "canvas";
import helpers from "../helpers/general.js";
const img_path_png = "./.data/temp.png";
const img_path_gif = "./.data/temp.gif";

export default (options, cb) => {
  /* 
    Based on http://generativeartistry.com/tutorials/joy-division/
  */
  console.log('making waves...');
  let width = options.width || 1184,
      height = options.height || 506,
      maxHeight = height - 100,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext("2d");
  
  ctx.lineWidth = helpers.getRandomInt(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let step = helpers.getRandomInt(8, 12);
  let startStep = 40;
  let lines = [];

  // Create the lines
  for( let i = step; i <= height - step; i += step) {

    let line = [];
    for( let j = startStep; j <= height - step; j+= step ) {
      let distanceToCenter = Math.abs(j - height / 2);
      let variance = Math.max(height / 2 - 50 - distanceToCenter, 0);
      
      let random = Math.random() * variance / 2 * -1;
      let point = {x: j+width/2-height/2, y: i + random};
      line.push(point)
    } 
    lines.push(line);
  }

  // Do the drawing
  for(let i = step; i < lines.length; i++) {

    ctx.beginPath();
    ctx.moveTo(lines[i][0].x, lines[i][0].y)
    for( let j = 0; j < lines[i].length - 2; j++) {
      let xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
      let yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
      ctx.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
    }

    ctx.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
    ctx.fill();

    ctx.stroke();
  }

  const out = fs.createWriteStream(img_path_png);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', function(){
    if (cb){
      cb(null, {
        path: img_path_png,
        data: canvas.toBuffer().toString('base64')
      });
    }
  });
}
