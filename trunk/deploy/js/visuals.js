var stats, scene, renderer;
var camera, cameraControl;
var cylinder;
var smallCubes = new THREE.Object3D();
var updateFcts = [];
var cameraSpeed = 0.0000;
// 1st phase
var cylinderZ = 0.001;
var cylinderY = 0.01;
		// init the scene
		function init(){

			if( Detector.webgl ){
				renderer = new THREE.WebGLRenderer({
					antialias		: true,	// to get smoother output
				});
				renderer.setClearColorHex( 0x000, 1 );
			}
			// uncomment if webgl is required
			//}else{
			//	Detector.addGetWebGLMessage();
			//	return true;
			// }else{
			// 	renderer	= new THREE.CanvasRenderer();
			// }
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.getElementById('container').appendChild(renderer.domElement);

			// add Stats.js - https://github.com/mrdoob/stats.js
			stats = new Stats();
			stats.domElement.style.position	= 'absolute';
			stats.domElement.style.bottom	= '0px';
			document.body.appendChild( stats.domElement );

			// create a scene
			scene = new THREE.Scene();

			// put a camera in the scene
			camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.set(0, 0, -2.24);
			//camera.position.set(0, 0, 10);
			//camera.position.z = 3;
			scene.add(camera);

			// transparently support window resize
			THREEx.WindowResize.bind(renderer, camera);
			

			updateFcts.push(function(delta, now){
				camera.position.x += (mouse.x*5 - camera.position.x) * 0.01
				camera.position.y += (mouse.y*5 - camera.position.y) * 0.01
				camera.lookAt(scene.position)
			})

			//////////////////////////////////////////////////////////////////////////////////
			//		Create Initial Scene						//
			//////////////////////////////////////////////////////////////////////////////////
	
			for(var x = -2; x <= 2; x+=4){
				for(var y = -3; y < 3; y++){
					for(var z = -70; z < 2; z+=5){
						var geometry	= new THREE.SphereGeometry( 0.5-0.15, 0.15)
						var material	= new THREE.MeshNormalMaterial( { wireframe: true, color: 0xfffff})
						var mesh	= new THREE.Mesh( geometry, material )
						//scene.add( mesh )
						smallCubes.add( mesh );
						mesh.position.x	= x
						mesh.position.y	= y
						mesh.position.z	= z
					}	
				}
			}	
			scene.add( smallCubes );

			var geometry = new THREE.SphereGeometry( 7, 7, 20, 32 );
			var material = new THREE.MeshBasicMaterial( { color: 0xffffff , wireframe: true} );
			cylinder = new THREE.Mesh( geometry, material );
			scene.add( cylinder );
			cylinder.position.z = 40;

		}

			// animation loop
		function animate() {

			// loop on request animation loop
			// - it haqs to be at the begining of the function
			// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
			requestAnimationFrame( animate );

			// do the render
			render();

			// update stats
			//stats.update();
		}

		// render the scene
		function render() {
			//rotate group
			smallCubes.rotation.y+=.002;

			var cylZ = cylinderZ;
			var cylY = cylinderY;

			cylinder.rotation.z += cylZ;
    		cylinder.rotation.y += cylY;


			camera.lookAt( scene.position );
			var speed = cameraSpeed;
			cylinder.position.z -= speed;
			camera.position.z -= speed ;
			// actually render the scene
			renderer.render( scene, camera );
		}