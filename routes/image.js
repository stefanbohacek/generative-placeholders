/* Expose files saved in the data folder. */

const express = require( 'express' ),
      fs = require( 'fs' ),
      router = express.Router(),
      helpers = require(__dirname + '/../helpers/general.js'),
      colors = require('nice-color-palettes'),
      generators = {
        cellular_automata: require(__dirname + '/../generators/cellular-automata.js'),
        tiled_lines: require(__dirname + '/../generators/tiled-lines.js'),
        circle_packing: require(__dirname + '/../generators/circle-packing.js'),
        cubic_disarray: require(__dirname + '/../generators/cubic-disarray.js'),
        joy_division: require(__dirname + '/../generators/joy-division.js'),
        triangular_mesh: require(__dirname + '/../generators/triangular-mesh.js'),
        un_deux_trois: require(__dirname + '/../generators/un-deux-trois.js'),
        mondrian: require(__dirname + '/../generators/mondrian.js')        
      },
      dbFile = "./.data/sqlite.db",
      exists = fs.existsSync(dbFile),
      sqlite3 = require( 'sqlite3' ).verbose(),
      db = new sqlite3.Database( dbFile );
      

function serveImage( res, error, img ){
   if ( img && img.data ){

    var imgBuffer = new Buffer( img.data, 'base64' );
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': imgBuffer.length 
    });
    res.end( imgBuffer );
   } else {
    error = error || 'unknown server error'
      res.end( error );
   }   
}

router.get( '/', function ( req, res )  {
  console.log( req.query );

  let width = 1200,
      height = 720,
      colorPalette = helpers.randomFromArray( colors );

  if ( req.query.colors ){
    const reqColors = parseInt( req.query.colors );
    if ( reqColors < colors.length ){
      colorPalette = colors[parseInt( req.query.colors )];
    }
  }

  if ( req.query.width ){
    const reqWidth = parseInt( req.query.width );
    if ( reqWidth > 0 && reqWidth <= 2000 ){
      width = reqWidth;
    }
  }
  
  if ( req.query.height ){
    const reqHeight = parseInt( req.query.height );
    if ( reqHeight > 0 && reqHeight <= 2000 ){
      height = reqHeight;
    }
  }
  
  const options = {
    style: req.query.style ? req.query.style : 'cellular-automata',
    width: width,
    height: height,
    colors: colorPalette.map( function( color ){ return color.replace( '#', '' ); } )
  }
  
  if ( options.style === 'circles' ){
    generators.circle_packing( options, function( error, img ){
      serveImage( res, error, img );
    } );    
  } else if ( options.style === 'triangles' ){
    if ( req.query.gap ){
      options.gap = parseInt( req.query.gap );
    }
    generators.triangular_mesh( options, function( error, img ){
      serveImage( res, error, img );
    } );    
  } else if ( options.style === 'tiles' ){
    /* Very slow! */
    generators.tiled_lines( options, function( error, img ){
      serveImage( res, error, img );
    } );
  } else if ( options.style === 'cellular-automata' ){
        
    if ( req.query.cells && parseInt( req.query.cells ) > 0 ){
      options.cells = parseInt( req.query.cells );
      if ( options.cells > 200 ){
        options.cells = 200;
      }
    } else {
      options.cells = helpers.getRandomInt(50, 100);  
    }
    
    generators.cellular_automata( options, function( error, img ){
      serveImage( res, error, img );
    } );
  } else if ( options.style === 'cubic-disarray' ){
    generators.cubic_disarray( options, function( error, img ){
      serveImage( res, error, img );
    } );
  } else if ( options.style === 'joy-division' ){
    generators.joy_division( options, function( error, img ){
      serveImage( res, error, img );
    } );
  } else if ( options.style === '123' ){
    generators.un_deux_trois( options, function( error, img ){
      serveImage( res, error, img );
    } );    
  } else if ( options.style === 'mondrian' ){
    options.colors = ['#D40920', '#1356A2', '#F7D842'];

    generators.mondrian( options, function( error, img ){
      serveImage( res, error, img );
    } );    
  }

//   const referer = req.headers.referer;

//   if ( req.query.style && referer && referer.indexOf( 'generative-placeholders.glitch.me' ) === -1 ){
//     const filePath = `${__dirname}/../.data/stats.json`,
//           date = new Date().toISOString().slice( 0, 10 ),
//           style = req.query.style;

//     fs.readFile( filePath, 'utf8', function ( err, data ) {
//       if ( err || !data ){
//         console.log( 'error reading stats data:', err );
//         data = {};
//         data[date] = {};
//         data[date][style] = 1;
//         data[date]['all'] = 1;
//       } else {
//         try{
//           data = JSON.parse( data );
//           data[date] = data[date] || {};
//           data[date][style] = data[date][style] || 0;
//           data[date]['all'] = data[date]['all'] || 0;

//           console.log( 'stats data:', data );

//           if ( data[date][style] ){
//             data[date][style]++;
//           } else {
//             data[date][style] = 1;
//           }

//           data[date]['all']++;

//         } catch( err ){ console.log( 'error parsing stats data:', err ) /* data = {}*/ }
        
//       }

//       fs.writeFileSync( filePath, JSON.stringify( data, null, 2 ), 'utf8' );
      
      
//     } );
//   }  
} );

module.exports = router;
