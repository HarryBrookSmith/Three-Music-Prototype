var stats, scene, renderer;
var camera, cameraControl;
var cylinder;
var smallCubes = new THREE.Object3D();
var updateFcts = [];
var cameraSpeed = 0.0000;
// 1st phase
var cylinderZ = 0.001;
var cylinderY = 0.01;
// post 
var rgbParams, rgbPass;
var kaleidoParams, kaleidoPass;
var composer;
var cubeHolder;
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
	//camera.position.set(0, 0, -2.24);
	camera.position.set(0, 0, 10);
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
				var material	= new THREE.MeshNormalMaterial( { wireframe: true, color: 0xffffff})
				var mesh	= new THREE.Mesh( geometry, material )
				//scene.add( mesh )
				smallCubes.add( mesh );
				mesh.position.x	= x
				mesh.position.y	= y
				mesh.position.z	= z
			}	
		}
	}	
	smallCubes.position.z = 90	
	scene.add( smallCubes );
	//use lambert material to get greyscale shadows
				//var material = new THREE.MeshLambertMaterial();
	var geometry = new THREE.SphereGeometry( 7, 7, 20, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff , wireframe: true} );
	cylinder = new THREE.Mesh( geometry, material );
	scene.add( cylinder );
	cylinder.position.z = -20;

	// add kalaedoscope
	initkEffect();

	loadSceneTwo();

}

function loadSceneTwo() {
	//init object to hold cubes and rotate
	cubeHolder = new THREE.Object3D();
	scene.add(cubeHolder);
	cubeHolder.position.z = -5000;
	//add light
	var light = new THREE.PointLight(0xF7F7F7, 1);
	light.position = new THREE.Vector3(1000, 1000, 1000);
	scene.add(light);

	//use lambert material to get greyscale shadows
	var material = new THREE.MeshLambertMaterial();

	//create cubes
	var geometry = new THREE.CubeGeometry(20, 20, 20);
	var spread = 2000;
	for(var j = 0; j < 100; j++) {
		var cube = new THREE.Mesh(geometry, material);
		//randomize size, posn + rotation
		cube.scale.x = cube.scale.y = cube.scale.z = Math.random() * 3 + .05;
		cubeHolder.add(cube);
		cube.position.x = Math.random() * spread - spread / 2;
		cube.position.y = Math.random() * spread - spread / 2;
		//cube.position.z = Math.random() * spread - spread / 2;
		cube.rotation.x = Math.random() * 2 * Math.PI - Math.PI;
		cube.rotation.y = Math.random() * 2 * Math.PI - Math.PI;
		//cube.rotation.z = Math.random() * 2 * Math.PI - Math.PI;
	}

}

	// animation loop
function animate() {

	// loop on request animation loop
	// - it haqs to be at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame( animate );

	// do the render
	render();

	composer.render( 0.1);

	// update stats
	stats.update();
}

// render the scene
function render() {
	// actually render the scene
	renderer.render( scene, camera );

	//camera.lookAt(scene);
}


// POST PROCESSING
function initkEffect() {
	//Create Shader Passes
	//render pass renders scene into effects composer
	var renderPass = new THREE.RenderPass( scene, camera );
	rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
	kaleidoPass = new THREE.ShaderPass( THREE.KaleidoShader );

	//Add Shader Passes to Composer
	//order is important
	composer = new THREE.EffectComposer( renderer);
	composer.addPass( renderPass );
	composer.addPass( kaleidoPass );
	composer.addPass( rgbPass );

	//set last pass in composer chain to renderToScreen
	rgbPass.renderToScreen = true;

	//Init DAT GUI control panel
	rgbParams = {
		amount: 0.005,
		angle: 0.0,
	}

	kaleidoParams = {
		sides: 12,
		angle: 0.0
	}

	var gui = new dat.GUI();
	
	var f1 = gui.addFolder('Kaleidoscope');
	f1.add(kaleidoParams, 'sides', 0, 24).step(1).onChange(onParamsChange);
	f1.add(kaleidoParams, 'angle', 0.0,2.0).step(0.1).onChange(onParamsChange);

	var f2 = gui.addFolder('RGB Shift');
	f2.add(rgbParams, 'amount', 0.0, 0.1).onChange(onParamsChange);
	f2.add(rgbParams, 'angle', 0.0, 2.0).onChange(onParamsChange);

	f1.open();
	f2.open();

	onParamsChange();

}

function onParamsChange() {
	//copy gui params into shader uniforms
	rgbPass.uniforms[ "angle" ].value = rgbParams.angle*3.1416;
	rgbPass.uniforms[ "amount" ].value = rgbParams.amount;
	kaleidoPass.uniforms[ "sides" ].value = kaleidoParams.sides;
	kaleidoPass.uniforms[ "angle" ].value = kaleidoParams.angle*3.1416;
}