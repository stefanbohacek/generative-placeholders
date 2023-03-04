const express = require('express'),
  fs = require('fs'),
  palettes = require('nice-color-palettes'),      
  router = express.Router();

router.get('/', (req, res) => {
  const filePath = `${__dirname}/../.data/stats.json`;
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    
    try{
      data = JSON.parse(data);
    } catch (err){
      data = {};
    }
    
    res.render('../views/stats.handlebars', {
      data: data,
      project_name: process.env.PROJECT_DOMAIN,
      sc_project: process.env.SC_PROJECT,
      sc_security: process.env.SC_SECURITY,
      palettes: palettes,    
      timestamp: Date.now()
    });
  });
});

module.exports = router;
