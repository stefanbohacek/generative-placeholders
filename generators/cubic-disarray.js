import fs from "fs";
import Canvas from "canvas";
import helpers from "../helpers/general.js";
const img_path_png = "./.data/temp.png";
const img_path_gif = "./.data/temp.gif";

export default (options, cb) => {
  /* 
    Based on http://generativeartistry.com/tutorials/cubic-disarray/
  */
  console.log("making cubes...");
  let width = options.width || 1184,
    height = options.height || 506,
    colors = options.colors || ["000", "fff"],
    canvas = Canvas.createCanvas(width, height),
    ctx = canvas.getContext("2d");

  ctx.lineWidth = helpers.getRandomInt(1, 4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let size = height;
  let squareSize = 40;
  let randomDisplacement = 15;
  let rotateMultiplier = 20;

  function draw(width, height) {
    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.stroke();
  }

  for (let i = squareSize; i <= width - squareSize; i += squareSize) {
    for (let j = squareSize; j <= height - squareSize; j += squareSize) {
      let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      let rotateAmt =
        (((j / size) * Math.PI) / 180) *
        plusOrMinus *
        Math.random() *
        rotateMultiplier;

      plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      let translateAmt =
        (j / size) * plusOrMinus * Math.random() * randomDisplacement;

      ctx.save();
      ctx.translate(i + translateAmt, j);
      ctx.rotate(rotateAmt);
      draw(squareSize, squareSize);
      ctx.restore();
    }
  }

  const out = fs.createWriteStream(img_path_png);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on("finish", function () {
    if (cb) {
      cb(null, {
        path: img_path_png,
        data: canvas.toBuffer().toString("base64"),
      });
    }
  });
};
