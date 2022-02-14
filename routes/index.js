const express = require( 'express' ),
  fs = require( 'fs' ),
  palettes = require('nice-color-palettes'),      
  router = express.Router();

router.get( '/', function( req, res ) {
  res.render( '../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    header_scripts: process.env.HEADER_SCRIPTS,
    palettes: palettes,    
    timestamp: Date.now()
  } );
} );

module.exports = router;
