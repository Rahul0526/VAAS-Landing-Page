
var SEPARATION = 80, AMOUNTX = 60, AMOUNTY = 60,
	container, stats, controls,
	camera, scene, renderer, renderer2,
	particles, particle, count = 0,
	mouseX = 0, mouseY = 0,
	raycaster,
	mouse, INTERSECTED,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	particlesTotal = AMOUNTX * AMOUNTY,
	current = 0,
	transformFrame = 60,
	positions = [],
	tweening = false,
	scale = 10,
	timer = 5000,
	panSpeed = 200,
	currentShape = 'wave',
	animateShapes = true;

var peples = null;

var waving = false,
	blinkable = false,
	verticalMovement = false;
var objects = [
		// {'name':'brain','obj':'_assets/images/modals/brain.obj'},
		// {'name':'skull','obj':'_assets/images/modals/bad skull.obj'},
		// {'name':'usb','obj':'_assets/images/modals/usb.obj'},
		// {'name':'paintBrush','obj':'_assets/images/modals/paintBrush.obj'},
		// {'name':'shield','obj':'_assets/images/modals/shield.obj'}
	];
var objectGeometries = [];
var objectCount = 0;

var spriteMap2, spriteMap3;
var materials=[];

(function() {
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	loadMaterials();
	// init();
	// animate();
	// loadObject();
	$(window).trigger('scroll');
})()

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		// console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};

var onError = function ( xhr ) {
};

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {

	// console.log( item, loaded, total );

};

function loadObject() {
	var geometries = new Array();
	var loader = new THREE.OBJLoader( manager );
	// console.log(objects[objectCount].obj)
	if(objects.length) {
		loader.load( objects[objectCount].obj, function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					// var obj = createPointCloud(child.geometry);
					// console.log('a')
					// scene.add( obj )
					geometries.push(child.geometry)
				}
			} );
			objectGeometries[objects[objectCount].name] = geometries;
			// console.log(objectGeometries)
			objectCount++;
			if(objectCount == objects.length) {
				init(objectGeometries);
				$('body').removeClass('loading').addClass('initializing');
				initializeSystem();
			} else {
				loadObject();
			}
		}, onProgress, onError );
	} else {
		init(objectGeometries);
		$('body').removeClass('loading').addClass('initializing');
		initializeSystem();
	}
}


//  Threejs animation functions
function loadMaterials() {
	var images = [
		// 'assets/images/sprites/snowflake7_alpha.png',
		generateSprite(['rgba(255,255,255,1)','rgba(0,255,255,1)','rgba(0,0,64,1)','rgba(0,0,0,0)']),
		generateSprite(['rgba(255,255,255,1)','rgba(229,108,247,1)','rgba(103,2,143,0.2)','rgba(0,0,0,0)']),
		generateSprite(['rgba(255,255,255,1)','rgba(255,255,255,0.6)','rgba(255,255,255,0.1)','rgba(0,0,0,0)']),
	];

	$.each(images, function(i, img) {
		var texture = img;
		// if(i <= 0 ) {
		// 	texture = new THREE.TextureLoader().load(img);
		// }
		var material = new THREE.SpriteMaterial( {
			map: texture,
			color: 0xff00ff,
			lights: true
		});
		materials.push(material);
	})
	// console.log(materials)
	loadObject();
}

function init(objectGeometries) {

	// container = document.getElementById( 'bodyBg' );
	// document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;
	camera.position.y = 200;
	controls = new THREE.OrbitControls( camera );
	controls.autoRotate = true;

	scene = new THREE.Scene();

	particles = new Array();

	var PI2 = Math.PI * 2;
	var spriteMap = new THREE.TextureLoader().load('assets/images/sprites/star3.png');

	// var material = new THREE.SpriteMaterial( {
	// 	// map: generateSprite(['rgba(255,255,255,1)','rgba(0,255,255,1)','rgba(0,0,64,1)','rgba(0,0,0,0)']),
	// 	map: generateSprite(['rgba(255,255,255,1)','rgba(255,255,255,0.6)','rgba(255,255,255,0.1)','rgba(0,0,0,0)']),
	// 	color: 0xff00ff,
	// 	lights: true
	// } );

	var i = 0;
	var opacity = 1/AMOUNTY;
	var planePos = [];
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i ++ ] = new THREE.Sprite( materials[0].clone() );
			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
			particle['newPositions'] = particle.position.clone();
			particle['newScale'] = {x:scale,y:scale,z:scale};
			// particle.material.color.b = Math.random() + 0.3;
			// particle.material.color.setHSL(1.0,0.0,0.0);
			scene.add( particle );
			planePos.push( {x:particle.position.x, y:particle.position.y, z:particle.position.z} );
		}
	}
	positions['wave'] = planePos;

	// // Cube
	var amount = Math.floor(Math.cbrt(AMOUNTX*AMOUNTY));
	var separation = 200;
	var offset = ( ( amount - 1 ) * separation ) / 2;
	var cubePos = [];
	for ( var i = 0; i < particlesTotal; i ++ ) {
		var x = ( i % amount ) * separation;
		var y = Math.floor( ( i / amount ) % amount ) * separation;
		var z = Math.floor( i / ( amount * amount ) ) * separation;

		cubePos.push( {x:x - offset, y:y - offset, z:z - offset} );
	}
	positions['cube'] = cubePos;

	// Random
	var randPos = [];
	for ( var i = 0; i < particlesTotal; i ++ ) {
		randPos.push({x:Math.random() * 4000 - 2000, y:Math.random() * 4000 - 2000, z:Math.random() * 4000 - 2000})
	}
	positions['random'] = randPos;
	// positions.push(randPos);
	// console.log(positions)

	// Sphere
	var spherPos = [];
	var radius = 500;
	for ( var i = 0; i < particlesTotal; i ++ ) {
		var phi = Math.acos( -1 + ( 2 * i ) / particlesTotal );
		var theta = Math.sqrt( particlesTotal * Math.PI * 2 ) * phi;

		spherPos.push({
			x:radius * Math.cos( theta ) * Math.sin( phi ),
			y:radius * Math.sin( theta ) * Math.sin( phi ),
			z:radius * Math.cos( phi )
		});
	}
	positions['sphareBig'] = spherPos;

	// Sphere
	var spherPos = [];
	var radius = 50;
	for ( var i = 0; i < particlesTotal; i ++ ) {
		var phi = Math.acos( -1 + ( 2 * i ) / particlesTotal );
		var theta = Math.sqrt( particlesTotal * Math.PI * 2 ) * phi;

		spherPos.push({
			x:radius * Math.cos( theta ) * Math.sin( phi ),
			y:radius * Math.sin( theta ) * Math.sin( phi ),
			z:radius * Math.cos( phi )
		});
	}
	positions['sphareSmall'] = spherPos;


	// creating object points from object geometries
	var bufferGeometry = new THREE.BufferGeometry();
	if(objectGeometries.length) {
		for(var key in objectGeometries) {
			var arrayLen = 0;
			var brainVertices = [];
			var coordinates = [];
			var geometries = objectGeometries[key];
			for(var i =0; i<geometries.length; i++) {
				var brainVerts;
				if(geometries[i].type == 'Geometry' ) {
					brainVerts = THREE.GeometryUtils.randomPointsInGeometry(geometries[i], Math.floor(particlesTotal/geometries.length));
				} else {
					brainVerts = THREE.GeometryUtils.randomPointsInBufferGeometry(geometries[i], Math.floor(particlesTotal/geometries.length));
				}

				var brain = new Float32Array( brainVerts.length * 3 );

				for ( var v = 0; v < brainVerts.length; v += 1 ) {
					coordinates.push({
						x:brainVerts[v].x,
						y:brainVerts[v].y,
						z:brainVerts[v].z
					});
				}
				brainVertices.push(brain);
			}
			positions[key] = coordinates;
		}
	}

	// peoples positions

	// var modalTexture = new THREE.TextureLoader().load( 'assets/images/modals/UV_Grid_Sm.jpg' );

	// var loader = new THREE.OBJLoader();
	// loader.load(
	// 	'assets/images/modals/peoples.obj', 
	// 	function(object) {
	// 		object.traverse( function ( child ) {

	// 			if ( child instanceof THREE.Mesh ) {

	// 				child.material.map = modalTexture;

	// 			}

	// 		} );

	// 		object.position.x = 0;
	// 		object.position.y = 0;
	// 		object.position.z = 0;
	// 		peoples = object;
	// 		scene.add( object );
	// 	},
	// 	function(xhr) {
	// 		console.log(xhr.loaded/xhr.total*100);
	// 	},
	// 	function(error) {
	// 		console.log('something went wrong')
	// 	}
	// );



	var canvas = document.querySelector('#first-slide #canvas3d');
	renderer = new THREE.CanvasRenderer({canvas:canvas, alpha: true});
	renderer.setClearColor( 0x000000, 0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	var canvas = document.querySelector('#bodyBg #canvas3d');
	renderer2 = new THREE.CanvasRenderer({canvas:canvas, alpha: true});
	renderer2.setClearColor( 0x000000, 0 );
	renderer2.setPixelRatio( window.devicePixelRatio );
	renderer2.setSize( window.innerWidth, window.innerHeight );
	// container.appendChild( renderer.domElement );

	// animate();
	// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	$(window).on('resize', onWindowResize).on('mousemove',onDocumentMouseMove)
	animate();
}
// document.addEventListener( 'dblclick', transition, false );


function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}


function onWindowResize() {
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer2.setSize( window.innerWidth, window.innerHeight );
}


var tweenTimeout;
function translate(attrs = []) {

	var coordinates;
	panSpeed = 100;
	tweening = true;
	scale = 30;

	currentShape = attrs.shape ? attrs.shape : 'wave';
	opacity = attrs.opacity ? attrs.opacity : 1;
	transformFrame = attrs.frames ? attrs.frames : 60;


	var cameraScaleX = 1;
	var cameraScaleY = 1;
	var autoRotation = true;
	var cameraX = 1000;
	var cameraZ = 1000;

	var tweenPause = 0;
	var material = materials[0];
	var easing =  'none';

	// 0:wave, 1:cube, 2:random, 3:big circle, 4:random, 5:small circle
	if(currentShape == 'wave') {
		tweenPause = -16*transformFrame;
		material = materials[2]
	} else if(currentShape == 'cube') {
		scale = 10;
		panSpeed = 300;
		material = materials[1]
	} else if(currentShape == 'random') {
		panSpeed = 150;
		tweenPause = -30;
		scale = 20;
		material = materials[2]
	} else if(currentShape == 'sphareBig') {
		scale = 15;
		material = materials[2]
	} else if(currentShape == 'random') {
		panSpeed = 150;
	} else if(currentShape == 'sphareSmall') {
		scale = 5;
	}

	if(attrs.materialId && attrs.materialId != 'random') 
	material = attrs.materialId ? materials[parseInt(attrs.materialId)] : material;
	scale = attrs.scale ? attrs.scale : scale;
	cameraScaleX = attrs.cameraScaleX ? attrs.cameraScaleX : cameraScaleX;
	cameraScaleY = attrs.cameraScaleY ? attrs.cameraScaleY : cameraScaleY;
	cameraX = attrs.cameraX ? attrs.cameraX : cameraX;
	cameraZ = attrs.cameraZ ? attrs.cameraZ : cameraZ;
	easing = attrs.easing ? attrs.easing : easing;

	autoRotation = attrs.autoRotation ? attrs.autoRotation : autoRotation;

	blinkable = attrs.blinkable ? attrs.blinkable : false;
	verticalMovement = attrs.verticalMovement ? attrs.verticalMovement : false;

	var duration = 16*transformFrame;
	// clearTimeout(tweenTimeout);
	controls.autoRotate = autoRotation;
	tweenTimeout = setTimeout(function() { tweening = false; }, duration+tweenPause)


	// console.log(attrs)
	// console.log(materials)
	coordinates = positions[currentShape];
	new TweenMax(camera.scale, d/1000, {x:cameraScaleX, y:cameraScaleY});
	new TweenMax(camera.position, 2, { x:cameraX, y:200, z:cameraZ });
	var _i = 0;
	for ( var i = 0; i < particles.length; i ++ ) {
		var particle = particles[i];
		if(particle) {
			if(!coordinates[_i]) _i = 0;
			particle['newPositions'] = coordinates[_i];
			particle.newScale = {x:scale,y:scale,z:scale};
			
			if(attrs.materialId) {
				if(attrs.materialId == 'random') {
					particle.material = randomValFromArray(materials).clone();
				} else {
					particle.material = materials[parseInt(attrs.materialId)].clone();					
				}
			} else {
				particle.material = material.clone();
			}

			if(currentShape == 'shield') {
				if(!particle.newScale) {
					console.log(i)
				}
			}
			// var d = Math.random() * duration + duration;
			var d = duration;
			var t1 = new TimelineMax()
			t1.add('end', 0)
			.to(particle.scale, d/1000, particle.newScale, 'end')
			.to(particle.position, d/1000, {x:particle.newPositions.x,y:particle.newPositions.y,z:particle.newPositions.z,ease: easing}, 'end')
			// .to(particle.position, d/1000, {x:particle.newPositions.x,y:particle.newPositions.y,z:particle.newPositions.z,ease: Elastic.easeOut.config( 1, 0.3)}, 'end')
			.to(particle.material, d/1000, {'opacity':opacity}, 'end')

			_i++;
		}
	}
}

function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

function randomCoordinates(arr) {
	var i = Math.floor(Math.random() * arr.length);
	var coordinates = arr[i];
	arr.splice(i, 1);
	return coordinates;
}

function animate() {
	// console.log(hasClass(renderer.domElement.parentElement.parentElement, 'animating'))
	if(animateShapes) {
		requestAnimationFrame( animate );
		// if(hasClass(renderer.domElement.parentElement.parentElement, 'animating')) {
		if($(renderer.domElement).closest('section').is('.animating') || $(renderer2.domElement).is(':visible')) {
			render();
		}
			// camera.lookAt( scene.position );
			// renderer.render( scene, camera );
		// }
	}
}

function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function render() {
	if(!tweening) {
		var i = particles.length ;

		for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
			for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
				particle = particles[ i-- ];
				if(particle) {

					// // 0:wave, 1:cube, 2:random, 3:big circle, 4:random, 5:small circle
					// if(currentShape == 'cube' || currentShape == 'sphareBig' || currentShape == 'sphareSmall') {

					// }
					// else 
					if(currentShape == 'wave') {
						// camera.position.y = 200;
						particle.position.y = particle.newPositions.y/2 + ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
						particle.scale.x = particle.scale.y = particle.scale.z = 1.5 * (( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4);
						
					}
					else if(currentShape == 'random') {
						// camera.position.y += ( - mouseY - camera.position.y ) ;
						particle.position.y += ( Math.sin( ( ix + count ) * 0.3 ) * 5 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 5 );
						// particle.position.x += ((Math.random() - 0.5))*(( Math.sin( ( ix + count ) * 0.3 ) * 5 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 5 ));
						particle.material.opacity = Math.sin( ( ix + count ) ) + Math.sin( ( iy + count ) );

					}

					if(blinkable) {
						particle.material.opacity = Math.sin( ( ix + count ) ) + Math.sin( ( iy + count ) );
					}

					// if(verticalMovement) {
					// 	camera.position.y += ( - mouseY - camera.position.y ) ;
					// }
				}
			}
		}
	}

	controls.update();
	camera.lookAt( scene.position );
	if($(renderer.domElement).closest('section').is('.animating')) {
		renderer.render( scene, camera );
	}

	if($(renderer2.domElement).is(':visible')) {
		renderer2.render( scene, camera );
	}
	count += 0.1;
}



function checkVisible( elm, evalType ) {
    evalType = evalType || "visible";

    var vpH = $(window).height(), // Viewport Height
        st = $(window).scrollTop(), // Scroll Top
        y = elm.offset().top,
        elementHeight = elm.height();

    if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
    if (evalType === "above") return ((y < (vpH + st)));
}


function generateSprite(colors) {
	// console.log(colors)
	var canvas = document.createElement('canvas');
	canvas.width = 80;
	canvas.height = 80;
	var context = canvas.getContext('2d');
	var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
	gradient.addColorStop(0, colors[0]);
	gradient.addColorStop(0.2, colors[1]);
	gradient.addColorStop(0.4, colors[2]);
	gradient.addColorStop(1, colors[3]);
	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return texture;
}


function initializeSystem() {
	var elems = $('#first-slide .main-title h1, #first-slide .main-title .sub-title,#first-slide .slide-logo ,#first-slide .get-started ,#first-slide .video-slide');
	
	var tl = new TimelineMax({
		// paused: true,
		onComplete:function() {
			enableScroll();
			backToCss(elems)
		}
	});
	// msg1 = new SplitText(".systemInitialization .msg1", {type:"words,chars"});
	// chars1 = msg1.chars;
	msg2 = new SplitText(".systemInitialization .msg2", {type:"words,chars"});
	chars2 = msg2.chars;


	TweenMax.set('.systemInitialization .msg1, .systemInitialization .msg2', {perspective:400});

	tl
	.to('.pageLoader', 0.5, {autoAlpha:0, display:'none'})
	// .staggerFrom(chars1, 1, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50",  ease:Back.easeOut, delay:0.2}, 0.03)
	// .staggerTo(chars1, 1, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50",  ease:Back.easeOut, delay:0.5}, 0.03, "+=0")

	.add('showGrid')
	.fromTo('.systemInitialization .msg3, #bodyBg #canvas3d', 1.3, {autoAlpha:0}, {autoAlpha:1, delay:0.2}, 'showGrid')
	.from('.systemInitialization .msg3', 1, {y:50})
	.staggerFrom(chars2, 1, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50", ease:Back.easeOut}, 0.03, "-=1.2")
	// .staggerTo(chars2, 0.8, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50",  ease:Back.easeOut, delay:1}, 0.02, "+=0")
	.to('.systemInitialization .msg3, #bodyBg #canvas3d', 1, {autoAlpha:0, delay:1})
	.add('showpage')
	.call(showPage)
	.staggerFrom(elems, 1, {autoAlpha:0, scale:2, delay:1}, 0.1 )
	.staggerFrom($('.intro-slide .slide'), 0.5, {transform:'translateX(0px) translateY(0px) scale(1,1)'}, 0.1 )
	.fromTo('#first-slide .video-slide a.play', 0.5, {scale:0}, {scale:1, delay: -0.2, ease:Bounce.easeOut})
	.fromTo('header', 1, {autoAlpha:0, display:'none'}, {autoAlpha:1, display:'block'})
	.from('#first-slide .bgi', 1.3, {autoAlpha:0})

	// tl.play('showpage')
}

function fromCenter(elem) {
	// console.log($(elem).offset().top)
	return $(window).innerHeight()/2 - $(elem).offset().top - $(elem).innerHeight()/2
}

function showPage() {
	$('body').removeClass('initializing')
	$('#bodyBg').hide();
	$('#first-slide').addClass('animating')
}

function toggleShapeAnimation(state) {
	if(state) {
		if(!animateShapes) {
			animateShapes = state;
			animate();
		}	
		animateShapes = state;
	} else {
		animateShapes = state;
	}
}