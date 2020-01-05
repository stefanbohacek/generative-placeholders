const express = require( 'express' ),
  fs = require( 'fs' ),
  router = express.Router();

router.get( '/', function( req, res ) {
  res.render( '../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    sc_project: process.env.SC_PROJECT,
    sc_security: process.env.SC_SECURITY,    
    timestamp: Date.now()
  } );
} );

module.exports = router;
