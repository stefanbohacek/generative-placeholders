import Canvas from "canvas";
import helpers from "../helpers/general.js";

export default (options, cb) => {
  /* 
    Based on https://generativeartistry.com/tutorials/circle-packing/
  */
  console.log("evolving cells...");

  let width = options.width || 1184,
    height = options.height || 506,
    size = width,
    colors = options.colors || ["000", "fff"],
    canvas = Canvas.createCanvas(width, height),
    ctx = canvas.getContext("2d");

  ctx.lineWidth = helpers.getRandomInt(1, 4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cells_across = options.cells; // Number of cells horizontally in the grid
  const cell_scale = width / cells_across; // Size of each cell
  const cells_down = height / cell_scale; // Number of cells vertically in the grid

  const rule = get_rule(helpers.getRandomInt(0, 255)); // The rule to display

  function get_bit(num, pos) {
    return (num >> pos) & 1;
  }

  // Combines 3 bits into an integer between 0 and 7
  function combine(b1, b2, b3) {
    return (b1 << 2) + (b2 << 1) + (b3 << 0);
  }

  // Returns given number in the form of a tertiary function (a rule)
  function get_rule(num) {
    return (b1, b2, b3) => get_bit(num, combine(b1, b2, b3));
  }

  function draw_rule(ctx, rule, scale, width, height) {
    let row = random_initial_row(width);
    for (let i = 0; i < height; i++) {
      draw_row(ctx, row, scale);
      row = next_row(row, rule);
    }
  }

  function draw_row(ctx, row, scale) {
    ctx.save();
    row.forEach((cell) => {
      ctx.fillStyle = cell === 1 ? "#" + colors[0] : "#" + colors[1];
      ctx.fillRect(0, 0, scale, scale);
      ctx.translate(scale, 0);
    });
    ctx.restore();
    ctx.translate(0, scale);
  }

  function next_row(old, rule) {
    return old.map((_, i) => rule(old[i - 1], old[i], old[i + 1]));
  }

  function initial_row(width) {
    const initial_row = Array(width).fill(0);
    initial_row[Math.floor(width / 2)] = 1;

    return initial_row;
  }

  function random_initial_row(width) {
    return Array.from(Array(width), (_) => Math.floor(Math.random() * 2));
  }

  draw_rule(ctx, rule, cell_scale, cells_across, cells_down);

  if (cb) {
    cb(null, {
      data: canvas.toBuffer().toString("base64"),
    });
  }
};
