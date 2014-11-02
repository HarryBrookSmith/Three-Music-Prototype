$(document).ready(function(){
	
    var AUDIO_FILE        = '../audio/trust';
    /*
     * Dancer.js magic
     */

    Dancer.setOptions({
      flashSWF : 'vendor/soundmanager2.swf',
      flashJS  : 'vendor/soundmanager2.js'
    });

    dancer = new Dancer();
    kick = dancer.createKick({
      onKick: function () {
        var i;
        console.log("KICK");
      },
      offKick: decay
    });

    dancer.onceAt( 0, function () {
      kick.on();
    }).onceAt( 8.2, function () {
    	console.log("8.2");
    }).after( 8.2, function () {
     // beamGroup.rotation.x += BEAM_RATE;
      //beamGroup.rotation.y += BEAM_RATE;
    }).onceAt( 50, function () {
      //changeParticleMat( 'white' );
    }).onceAt( 66.5, function () {
     // changeParticleMat( 'pink' );
    }).onceAt( 75, function () {
      //changeParticleMat();
    }).load({ src: AUDIO_FILE, codecs: [ 'mp3' ]})

    Dancer.isSupported() || loaded();
    !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

    
 /*
   * Three.js Setup
   */

  function on () {
    console.info("On");
  }

  function decay () {
    console.info("Decay");
  }

  function loaded () {
    var
      loading = document.getElementById( 'loading' ),
      anchor  = document.createElement('A'),
      supported = Dancer.isSupported(),
      p;

    anchor.appendChild( document.createTextNode( supported ? 'Play!' : 'Close' ) );
    anchor.setAttribute( 'href', '#' );
    loading.innerHTML = '';
    loading.appendChild( anchor );

    if ( !supported ) {
      p = document.createElement('P');
      p.appendChild( document.createTextNode( 'Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!' ) );
      loading.appendChild( p );
    }

    anchor.addEventListener( 'click', function () {
      dancer.play();
      document.getElementById('loading').style.display = 'none';
    }, false );

  }

  on();

  // For debugging
  window.dancer = dancer;

});
