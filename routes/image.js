/* Expose files saved in the data folder. */

import express from "express";
import fs from "fs";
import helpers from "../helpers/general.js";
import sqlite3 from "sqlite3";
import generator_cellular_automata from "../generators/cellular-automata.js";
import generator_tiled_lines from "../generators/tiled-lines.js";
import generator_circle_packing from "../generators/circle-packing.js";
import generator_cubic_disarray from "../generators/cubic-disarray.js";
import generator_joy_division from "../generators/joy-division.js";
import generator_triangular_mesh from "../generators/triangular-mesh.js";
import generator_un_deux_trois from "../generators/un-deux-trois.js";
import generator_mondrian from "../generators/mondrian.js";

import { readFileSync } from "fs";
const palettes = JSON.parse(
  readFileSync("./node_modules/nice-color-palettes/100.json", "utf-8")
);

const generators = {
  cellular_automata: generator_cellular_automata,
  tiled_lines: generator_tiled_lines,
  circle_packing: generator_circle_packing,
  cubic_disarray: generator_cubic_disarray,
  joy_division: generator_joy_division,
  triangular_mesh: generator_triangular_mesh,
  un_deux_trois: generator_un_deux_trois,
  mondrian: generator_mondrian,
};
const router = express.Router();

const serveImage = (res, error, img) => {
  if (img && img.data) {
    var imgBuffer = new Buffer(img.data, "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": imgBuffer.length,
    });
    res.end(imgBuffer);
  } else {
    error = error || "unknown server error";
    res.end(error);
  }
};

router.get("/", (req, res) => {
  console.log(req.query);

  let width = 1200,
    height = 720,
    colorPalette = helpers.randomFromArray(palettes);

  if (req.query.colors) {
    const reqColors = parseInt(req.query.colors);
    if (reqColors < palettes.length) {
      colorPalette = palettes[parseInt(req.query.colors)];
    }
  }

  if (req.query.width) {
    const reqWidth = parseInt(req.query.width);
    if (reqWidth > 0 && reqWidth <= 2000) {
      width = reqWidth;
    }
  }

  if (req.query.height) {
    const reqHeight = parseInt(req.query.height);
    if (reqHeight > 0 && reqHeight <= 2000) {
      height = reqHeight;
    }
  }

  const options = {
    style: req.query.style ? req.query.style : "cellular-automata",
    width: width,
    height: height,
    colors: colorPalette.map((color) => {
      return color.replace("#", "");
    }),
  };

  if (options.style === "circles") {
    generators.circle_packing(options, (error, img) => {
      serveImage(res, error, img);
    });
  } else if (options.style === "triangles") {
    if (req.query.gap) {
      options.gap = parseInt(req.query.gap);
    }
    generators.triangular_mesh(options, (error, img) => {
      serveImage(res, error, img);
    });
  } else if (options.style === "tiles") {
    /* Very slow! */
    generators.tiled_lines(options, (error, img) => {
      serveImage(res, error, img);
    });
  } else if (options.style === "cellular-automata") {
    if (req.query.cells && parseInt(req.query.cells) > 0) {
      options.cells = parseInt(req.query.cells);
      if (options.cells > 200) {
        options.cells = 200;
      }
    } else {
      options.cells = helpers.getRandomInt(50, 100);
    }

    generators.cellular_automata(options, (error, img) => {
      serveImage(res, error, img);
    });
  } else if (options.style === "cubic-disarray") {
    generators.cubic_disarray(options, (error, img) => {
      serveImage(res, error, img);
    });
  } else if (options.style === "joy-division") {
    generators.joy_division(options, (error, img) => {
      serveImage(res, error, img);
    });
  } else if (options.style === "123") {
    generators.un_deux_trois(options, (error, img) => {
      serveImage(res, error, img);
    });
  } else if (options.style === "mondrian") {
    options.colors = ["#D40920", "#1356A2", "#F7D842"];

    generators.mondrian(options, (error, img) => {
      serveImage(res, error, img);
    });
  }
});

export default router;
