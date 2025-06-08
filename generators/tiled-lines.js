import fs from "fs";
import Canvas from "canvas";
import helpers from "../helpers/general.js";
const img_path_png = "./.data/temp.png";

export default (options, cb) => {
  /* 
    Based on http://generativeartistry.com/tutorials/tiled-lines/
  */
  console.log('drawing lines...');
  var width = options.width || 1184,
      height = options.height || 506,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext('2d');

  ctx.lineWidth = helpers.getRandomInt(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var step = helpers.getRandomInt(15,25);

  function draw(x, y, width, height) {
    var leftToRight = Math.random() >= 0.5;

    if( leftToRight ) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);    
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);
    }

    ctx.stroke();
  }

  for( var x = 0; x < width; x += step) {
    for( var y = 0; y < height; y+= step ) {
      draw(x, y, step, step);
    }
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
