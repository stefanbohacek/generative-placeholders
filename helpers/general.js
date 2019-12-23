var helpers = {
  ready: function( fn ) {
    if ( document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading' ){
      fn();
    } else {
      document.addEventListener( 'DOMContentLoaded', fn );
    }
  },
  loadData: function( options, cb ){
    let statusIndicator = document.getElementById('status');
    if ( statusIndicator ){
      statusIndicator.innerHTML = 'Loading data...';
    }
    function loadDataFromUrl(url, cb){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){

          if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                  var data = JSON.parse(xhr.responseText);

                  if ( statusIndicator ){
                    statusIndicator.parentNode.removeChild(statusIndicator);
                  }

                  if ( data ){
                    if ( typeof Storage !== 'undefined' ){
                      /* Set how long we want to cache the data for, in minutes. */
                      const expirationMinutes = 10;
                      let inXMinutes = new Date( new Date().getTime() + expirationMinutes * 60 * 1000 );

                      localStorage.setItem( 'data', JSON.stringify( data ) );
                      localStorage.setItem( 'data_expiration', inXMinutes );
                    }

                    if ( cb ){
                      cb( null, data );
                    }
                  }
                  else{
                    throw 'data not loaded';
                  }                    
              } else {
                  if (cb){
                    cb(xhr);
                  }
              }
          }
      };
      xhr.open("GET", url, true);
      xhr.send();
    }
    
    if ( typeof Storage !== 'undefined' ){
      let data = localStorage.getItem('data');
      const dataExpiration = Date.parse( localStorage.getItem( 'data_expiration' ) ),
            dateNow = new Date();

      if ( dataExpiration && data ){
        if ( dateNow > dataExpiration ){
          loadDataFromUrl( options.url, cb );
        } else {
          try{
            data = JSON.parse( data );
            if ( statusIndicator ){
              statusIndicator.parentNode.removeChild(statusIndicator);
            }
            if ( cb ){
              cb( null, data );
            }
          } catch (err){
            if ( cb ){
              cb( err, null );
            }        
          }
        }
      }
      else{
        loadDataFromUrl( options.url, cb );
      }      
    } else {
      loadDataFromUrl( options.url, cb );
    }
  },  
  randomFromArray: function(arr) {
    return arr[Math.floor(Math.random()*arr.length)]; 
  },
  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getRandomRange: function(min, max, fixed) {
    return (Math.random() * (max - min) + min).toFixed(fixed) * 1;
  },
  getRandomHex: function( includePound ) {
    return ( includePound ? '#' : '' ) + Math.random().toString(16).slice(2, 8).toUpperCase();
  },
  shadeColor: function(color, percent) {
    // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    var f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return `#${(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1)}`;
  },
  colorOpacity: function(color, opacity) {
  /* A helper function that takes an rgb color and adds opacity to it. */
    opacity =
      opacity ||
      0.5 /* If no value is passed to the function, 0.5 will be used as a default value. */;
    return color.replace("rgb", "rgba").replace(")", "," + opacity + ")");
  },
  numberWithCommas: function( x ){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },  
  sortByFollowersCount: function( a, b ){
    if ( parseInt( a.followers_count ) < parseInt( b.followers_count ) ){
      return -1;
    }
    if ( parseInt( a.followers_count ) > parseInt( b.followers_count ) ){
      return 1;
    }
    return 0;
  }  
};

if (typeof module !== 'undefined'){
  /* This is to make the file usable both in node and on the front end. */
  module.exports = helpers;
}
