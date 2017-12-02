var Shaders = {

	'earth' : {

		uniforms: {

			"texture": { type: "t", value: 0, texture: null }

		},

		vertexShader: [

			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"vNormal = normalize( normalMatrix * normal );",
				"vUv = uv;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D texture;",

			"varying vec3 vNormal;",
			"varying vec2 vUv;",

			"void main() {",

				"vec3 diffuse = texture2D( texture, vUv ).xyz;",
				"float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );",
				"vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );",

				"gl_FragColor = vec4( diffuse + atmosphere, 1.0 );",

			"}"

		].join("\n")

	},

	'atmosphere' : {

		uniforms: {},

		vertexShader: [

			"varying vec3 vNormal;",

			"void main() {",

				"vNormal = normalize( normalMatrix * normal );",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"varying vec3 vNormal;",

			"void main() {",

				"float intensity = pow( 0.8 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 12.0 );",
				"gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;",

			"}"

		].join("\n")

	}

};



//plotData();

var container, stats;
var camera, scene, sceneAtmosphere, renderer;
var vector, mesh, atmosphere, point, points, pointsGeometry;

var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
var rotation = { x: 0, y: 0 }, target = { x: 0, y: 0 }, targetOnDown = { x: 0, y: 0 };
var distance = 1500, distanceTarget = 900;

var PI_HALF = Math.PI / 2;

init();

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 1, 10000 );

	//renderer = new THREE.WebGLRenderer();
	//renderer.setSize( window.innerWidth, window.innerHeight );


	var geometry = new THREE.SphereGeometry( 200, 40, 30 );
	var shader = Shaders[ 'earth' ];
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	//var material  = new THREE.MeshPhongMaterial({ color: 0x00ff00 } )
	material = new THREE.MeshBasicMaterial( { color: 0x999999 } );
	/*
        uniforms['texture'].texture = new THREE.TextureLoader().load('world.jpg')

        material = new THREE.RawShaderMaterial({

            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader

        });
	*/
	material.map    = new THREE.TextureLoader().load('world.jpg')
	cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light )
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

	//console.log(distance)
	camera.position.z = distance;

	renderer = new THREE.WebGLRenderer( /* { antialias: false } */ );
	//renderer.autoClear = false;
	//renderer.setClearColor( 0x101010, 1.0 );
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	//document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

	window.addEventListener( 'resize', onWindowResize, false );

}
function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	rotation.x += ( target.x - rotation.x ) * 0.05;
	rotation.y += ( target.y - rotation.y ) * 0.05;
	distance += ( distanceTarget - distance ) * 0.05;

	camera.position.x = distance * Math.sin( rotation.x ) * Math.cos( rotation.y );
	camera.position.y = distance * Math.sin( rotation.y );
	camera.position.z = distance * Math.cos( rotation.x ) * Math.cos( rotation.y );

	/*
	// Do not render if camera hasn't moved.

	if ( vector.distanceTo( camera.position ) == 0 ) {

		return;

	}

	vector.copy( camera.position );
	*/

	renderer.clear();
	renderer.render( scene, camera );
	//renderer.render( sceneAtmosphere, camera );
}

function onWindowResize( event ) {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	mouse.x = - event.clientX;
	mouse.y = event.clientY;

	target.x = targetOnDown.x + ( mouse.x - mouseOnDown.x ) * 0.005;
	target.y = targetOnDown.y + ( mouse.y - mouseOnDown.y ) * 0.005;

	target.y = target.y > PI_HALF ? PI_HALF : target.y;
	target.y = target.y < - PI_HALF ? - PI_HALF : target.y;

}

function onDocumentMouseUp( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

	container.style.cursor = 'auto';

}

function onDocumentMouseOut( event ) {

	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

function onDocumentMouseDown( event ) {

	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseOnDown.x = - event.clientX;
	mouseOnDown.y = event.clientY;

	targetOnDown.x = target.x;
	targetOnDown.y = target.y;

	container.style.cursor = 'move';

}

animate();