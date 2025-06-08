import express from "express";
import { readFileSync } from 'fs';
const palettes = JSON.parse(
  readFileSync('./node_modules/nice-color-palettes/100.json', 'utf-8')
);

const router = express.Router();

router.get('/', (req, res) => {
  res.render('../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    head_scripts: process.env.HEAD_SCRIPTS,
    palettes: palettes,    
    timestamp: Date.now()
  });
});

export default router;
