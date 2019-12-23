const fs = require( 'fs' ),
      helpers = require( __dirname + '/helpers/general.js' ),      
      Twit = require( 'twit' ),    
      dataFilePath = __dirname + '/data/data.json',
      botListFilePath = __dirname + '/data/bots.json';

let dataSync = {
  reload: function( cb ){
    console.log( 'reloading data...' );
    
    let twit = new Twit( {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      app_only_auth: true
    } );
    
    twit.get( 'lists/members', {
      owner_screen_name: process.env.TWITTER_USERNAME,
      slug: process.env.TWITTER_LIST_NAME,
      count: 5000,
      skip_status: true
    }, function( err, data, response ) {
      if ( err ){
        console.log( 'error:', err );
      }
      else if ( data && data.users ){
        let bots = [];
        data.users.forEach(  function ( user ){
          bots.push( user.screen_name );
        } );

        console.log( bots );
    
        if ( bots && bots.length ){

          twit.get( 'users/lookup', {
            screen_name: bots.join(',')
          }, function( err, data, response ) {
            if ( err ){
              console.log( err );
            } else {
              let updatedBotData = [];
              data.forEach( function( bot ){
                  updatedBotData.push( {
                      id_str: bot.id_str,
                      name: bot.name,
                      screen_name: bot.screen_name,
                      description: bot.description,
                      followers_count: bot.followers_count,
                      friends_count: bot.friends_count,
                      created_at: bot.created_at,
                      last_tweet_date: bot.status ? bot.status.created_at : null,                    
                      favourites_count: bot.favourites_count,
                      verified: bot.verified,
                      statuses_count: bot.statuses_count,
                      profile_background_image_url_https: bot.profile_background_image_url_https,
                      profile_image_url_https: bot.profile_image_url_https
                  } );
              } );

              // console.log( updatedBotData );

              fs.writeFile( dataFilePath, JSON.stringify( {
                last_update: Date.now(),
                data: updatedBotData.sort( helpers.sortByFollowersCount )
              } ), function ( err ) {
               if ( err ){
                 console.log( err )
               } else {
                  console.log( 'data file updated' );
               }
              } );  
              if ( cb ){
                cb( null, updatedBotData );
              }
            }
          } );        
        }         
      }
    } ); 
  },
  sync: function( cb ){
    let botData = fs.readFileSync( dataFilePath ),
        dataSync = this;

    try{
      botData = JSON.parse( botData );
    } catch ( err ){ console.log( err ) }

    if ( botData ){
      // console.log( botData );
      botData.data = botData.data.sort( helpers.sortByFollowersCount );
      
      let syncIntervalMinutes = 60;

      if ( process.env.SYNC_INTERVAL_MINUTES && process.env.SYNC_INTERVAL_MINUTES > 15 ){
        syncIntervalMinutes = parseInt( process.env.SYNC_INTERVAL_MINUTES );
      }
      
      var todayDate = new Date(),
          lastCheckDate = new Date( botData.last_update ),
          expirationDate = new Date( lastCheckDate.getTime() + ( syncIntervalMinutes * 60000 ) );
      
      console.log( {
          'lastCheckDate': lastCheckDate,
          'syncIntervalMinutes' : `${syncIntervalMinutes} (${ ( syncIntervalMinutes/60 ).toFixed( 3 ) } hours)`,
          'expirationDate': expirationDate,
          'todayDate': todayDate,
          'dataExpired': todayDate > expirationDate,
          // 'botData': botData
      } );
      
      if ( !botData || !botData.data || !botData.data.length || todayDate > expirationDate ){
        /* Update data */
        dataSync.reload( function( err, data ){
          cb( null, data );
        });
      } else {
        if ( cb ){
          cb( null, botData );
        }
      }
    }
  }  
}

module.exports = dataSync;
