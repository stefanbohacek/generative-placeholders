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
  var width = options.width || 1184,
      height = options.height || 506,
      maxHeight = height - 100,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext("2d");
  
  ctx.lineWidth = helpers.getRandomInt(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var step = helpers.getRandomInt(8, 12);
  var startStep = 40;
  var lines = [];

  // Create the lines
  for( var i = step; i <= height - step; i += step) {

    var line = [];
    for( var j = startStep; j <= height - step; j+= step ) {
      var distanceToCenter = Math.abs(j - height / 2);
      var variance = Math.max(height / 2 - 50 - distanceToCenter, 0);
      
      var random = Math.random() * variance / 2 * -1;
      var point = {x: j+width/2-height/2, y: i + random};
      line.push(point)
    } 
    lines.push(line);
  }

  // Do the drawing
  for(var i = step; i < lines.length; i++) {

    ctx.beginPath();
    ctx.moveTo(lines[i][0].x, lines[i][0].y)
    for( var j = 0; j < lines[i].length - 2; j++) {
      var xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
      var yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
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
