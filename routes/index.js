const express = require( 'express' ),
  fs = require( 'fs' ),
  router = express.Router();

router.get( '/', function( req, res ) {
  res.render( '../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    timestamp: Date.now()
  } );
} );

module.exports = router;
