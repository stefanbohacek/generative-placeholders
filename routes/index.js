const express = require('express'),
  fs = require('fs'),
  palettes = require('nice-color-palettes'),      
  router = express.Router();

router.get('/', (req, res) => {
  res.render('../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    head_scripts: process.env.HEAD_SCRIPTS,
    palettes: palettes,    
    timestamp: Date.now()
  });
});

module.exports = router;
