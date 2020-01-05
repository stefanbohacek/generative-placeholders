document.addEventListener( 'DOMContentLoaded', function(event){
  document.querySelectorAll( 'pre code' ).forEach( function( block ){
    hljs.highlightBlock( block );
  });
  let examples = document.querySelectorAll( '.example' );
  
  examples.forEach( function( example ){
    example.addEventListener( 'click', function( event ){
      event.preventDefault();
      let dataSrc = this.dataset.src;
      if ( dataSrc ){
        this.src = dataSrc;         
        this.dataset.src = '';
      } else {
        this.src = this.src + '&'; 
      }
      return false;
    } );
  } )
});
