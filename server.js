const app = require( __dirname + '/app.js' );

var listener = app.listen(process.env.PORT, function() {
  console.log( `app is running on port ${listener.address().port}...` );
} );  
