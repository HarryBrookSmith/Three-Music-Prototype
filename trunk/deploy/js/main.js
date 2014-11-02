var AUDIO_FILE        = '../audio/trust';


$(document).ready(function(){

    // Init Visuals.js
    if( !init() )   animate();

    Dancer.setOptions({
      flashSWF : 'vendor/soundmanager2.swf',
      flashJS  : 'vendor/soundmanager2.js'
    });

    dancer = new Dancer();
    kick = dancer.createKick({
      onKick: function () {
        randomizeCubes();
      },
      offKick: decay,
      frequency: [2, 4]
    });

    // Let's turn this kick on right away
    kick.on();

    dancer.after( 0, function(){
        //console.info(dancer.getTime())

        // stop rotating when reach certain angle
        //if (smallCubes.rotation.y < 3.142){
           // smallCubes.rotation.y += .002;
        //}
        //get current coordinates
        var cylZ = cylinderZ;
        var cylY = cylinderY;

        cylinder.rotation.z += cylZ;
        cylinder.rotation.y += cylY;
        // get current speed
        var speed = cameraSpeed;
        // apply speed
        cylinder.position.z += speed;
        camera.position.z += speed;
        // init kalaedoscope
        cubeHolder.position.z += 1;





    }).onceAt( 0, function () {
        // start kick event listener
        kick.on();
        //start cylinder moving slowly
        var cylinderZ = 0;
        var cylinderY = 0.01;

        //loadSceneTwo();
        
    }).onceAt( 32.8, function () {
        cylinderZ = 0.1;
    }).load({ src: AUDIO_FILE, codecs: [ 'mp3' ]})
    // Detect Support 
    Dancer.isSupported() || loaded();
    !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

    /*
    * Three.js Setup
    */

    function on () {
        console.info("On");
    }

    function decay () {
        //console.info("Decay");
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
        cameraSpeed = 0.0129;
        document.getElementById('loading').style.display = 'none';
    }, false );



    }

    on();

    // For debugging
    window.dancer = dancer;

});

function randomizeCubes(){
    cubeHolder.rotation.x = Math.random() * 2 * Math.PI - Math.PI;
    cubeHolder.rotation.y = Math.random() * 2 * Math.PI - Math.PI;
}
