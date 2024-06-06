import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Rain} from './rain.js';

const g_canvas = document.getElementById('webgl');
const g_scene = new THREE.Scene();
const g_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
const g_texLoader = new THREE.TextureLoader();
const g_cubeTexLoader = new THREE.CubeTextureLoader();
const g_objLoader = new OBJLoader();
const g_mtlLoader = new MTLLoader();
var g_startTime = performance.now()/1000.0;
var g_secondsPassed = performance.now()/1000.0 - g_startTime;
var g_animationPhase = 0;


let cat, sphere, rain = null;

const renderer = new THREE.WebGLRenderer({antialias: true, g_canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

g_camera.position.set( 0, 300, 500 );
const controls = new OrbitControls(g_camera, renderer.domElement);

addFloor();
addMoon();
addCat();
addLight();
rain = new Rain([1200,1000,1200], 4, 12000);
rain.addToScene(g_scene);

animate();
addSky();

function animate() {
	requestAnimationFrame( animate );
	g_secondsPassed = performance.now()/1000.0 - g_startTime;
	const animationTime = g_secondsPassed % 8;
	rain.update();
	if(cat != null)
	{
		if(animationTime < 2)
		{
			if(g_animationPhase != 0) {
				g_animationPhase = 0;
				cat.rotation.z = Math.PI;
				cat.position.x = 80;
				cat.position.y = 10;
				cat.position.z = 300;
			}
			cat.translateY(-2);
		}
		else if(animationTime <= 4 )
		{
			if(g_animationPhase != 1)	{
				g_animationPhase = 1;
				cat.position.x = 80;
				cat.position.y = 10;
				cat.position.z = -355;
				cat.rotation.z = -Math.PI / 2;
			}
			cat.translateY(-0.5);
		}
		else if(animationTime <= 6)
		{
			if(g_animationPhase != 2)	{
				g_animationPhase = 2;
				cat.position.x = -80;
				cat.position.y = 10;
				cat.position.z = -355;
				cat.rotation.z = 0;
			}
			cat.translateY(-2);
		}
		else
		{
			if(g_animationPhase != 3)	{
				g_animationPhase = 3;
				cat.position.x = -80;
				cat.position.y = 10;
				cat.position.z = 300;
				cat.rotation.z = Math.PI / 2;
			}
			cat.translateY(-0.5);
		}
	}

	controls.update();
	renderer.render( g_scene, g_camera );
}

function addFloor()
{
	const grassTex = g_texLoader.load( 'textures/grass.jpg' );
	grassTex.wrapS = THREE.RepeatWrapping;
	grassTex.wrapT = THREE.RepeatWrapping;
	grassTex.repeat.set( 30, 30 );
	grassTex.colorSpace = THREE.SRGBColorSpace;
	const grassGeo = new THREE.CylinderGeometry( 600, 600, 20 );
	const grassMat = new THREE.MeshStandardMaterial( {
		color: 0x006400,
		map: grassTex
	} );
	const grass = new THREE.Mesh( grassGeo, grassMat );
	grass.translateY(-20);
	g_scene.add( grass );


	const dirtTex = g_texLoader.load( 'textures/dirt.jpg' );
	dirtTex.wrapS = THREE.RepeatWrapping;
	dirtTex.wrapT = THREE.RepeatWrapping;
	dirtTex.repeat.set( 15, 15 );
	dirtTex.colorSpace = THREE.SRGBColorSpace;
	const dirtGeo = new THREE.CylinderGeometry( 600, 600, 500 );
	const dirtMat = new THREE.MeshStandardMaterial( {
		color: 0xFFFFFF,
		map: dirtTex
	} );
	const dirt = new THREE.Mesh( dirtGeo, dirtMat );
	dirt.translateY(-270);
	g_scene.add( dirt );

	const roadTex = g_texLoader.load( 'textures/asphalt.jpg' );
	roadTex.wrapS = THREE.RepeatWrapping;
	roadTex.wrapT = THREE.RepeatWrapping;
	roadTex.repeat.set( 8, 30 );
	roadTex.colorSpace = THREE.SRGBColorSpace;

	const streetLen = 1100;
	const streetWidth = 400;
	const dividerLen = 50;
	var streetGeo = new THREE.BoxGeometry( streetWidth, 10, streetLen );
	var streetMat = new THREE.MeshStandardMaterial( {
		color: 0x555555,
		map: roadTex
	} );
	g_scene.add( new THREE.Mesh( streetGeo, streetMat ) );

	streetGeo = new THREE.BoxGeometry( 20, 20, streetLen );
	streetMat = new THREE.MeshStandardMaterial( {
		color: 0xFFFFFF,
		map: roadTex
	});
	streetGeo.translate(streetWidth / 2,0,0);
	g_scene.add( new THREE.Mesh( streetGeo, streetMat ) );

	streetGeo = new THREE.BoxGeometry( 20, 20, streetLen );
	streetGeo.translate(-streetWidth / 2,0,0);
	g_scene.add( new THREE.Mesh( streetGeo, streetMat ) );

	for(var i = -streetLen / 2 + dividerLen * 2; i < streetLen / 2 - dividerLen; i += 3 * dividerLen)
	{
		streetGeo = new THREE.BoxGeometry( 20, 10, dividerLen );
		streetMat = new THREE.MeshStandardMaterial( {color: 0xefd73f} );
		streetGeo.translate(0,.5,i);
		g_scene.add( new THREE.Mesh( streetGeo, streetMat ) );
	}

	for(var i = -streetLen / 2 + dividerLen * 2; i < streetLen / 2 - dividerLen; i += 3 * dividerLen)
		{
			streetGeo = new THREE.BoxGeometry( 20, 10, dividerLen );
			streetMat = new THREE.MeshStandardMaterial( {color: 0xefd73f} );
			streetGeo.translate(0,.5,i);
			g_scene.add( new THREE.Mesh( streetGeo, streetMat ) );
		}
	
	const sLightDist = 210;
	var toggleSide = false;
	for (var i = -streetLen / 2 + sLightDist; i < streetLen / 2 - sLightDist; i += sLightDist) {
		if (toggleSide) {
			addStreetLight([-streetWidth * .6, 10, i], 3, 600, toggleSide, 0xFFFFFF);
		}
		else {
			addStreetLight([streetWidth * .6, 10, i], 3, 600, toggleSide, 0xFFFFFF);
		}
		toggleSide = !toggleSide;
	}

}


function addMoon()
{
	const sphGeo = new THREE.SphereGeometry(50);
	const texture = g_texLoader.load( 'textures/moon.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;
	const sphMat = new THREE.MeshBasicMaterial( { 
		color: 0xFFFFFF,
		map: texture
	});
	sphere = new THREE.Mesh( sphGeo, sphMat );
	sphere.translateZ(-500);
	sphere.translateY(600);
	g_scene.add( sphere );

	const light = new THREE.DirectionalLight(0xDDDDDD, .15);
	light.position.set(0, 250, -250);
	light.target.position.set(0, 0, 0)
	light.castShadow = true;
    g_scene.add(light);
	g_scene.add(light.target);
}

function addSky()
{
	g_cubeTexLoader.setPath('textures/')
	const texture = g_cubeTexLoader.load([
		'rightSky.png', 'leftSky.png',
		'topSky.png', 'bottomSky.png',
		'frontSky.png', 'backSky.png'
	 ]);
	g_scene.background = texture;
}

function addCat()
{
	g_mtlLoader.load('cat/12221_Cat_v1_l3.mtl', (mtl) => {
		mtl.preload();
		g_objLoader.setMaterials(mtl);
		g_objLoader.load(
			// resource URL
			'cat/12221_Cat_v1_l3.obj',
			// called when resource is loaded
			function ( object ) {
				cat = object;
				cat.translateY(10);
				cat.translateX(80);
				cat.translateZ(200);
				cat.rotateX(-Math.PI / 2);
				cat.rotateZ(Math.PI)
				g_scene.add( object );
			},
			// called when loading is in progresses
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened' );
			});
	});
}

function addLight()
{
    g_scene.add(new THREE.AmbientLight(0xFFFFFF, .1));
}

function addStreetLight(translate, scale, intensity, isFlipped = false, lColor=0xFFFFFF)
{
	intensity = Math.pow(intensity, 2);
	var currentObj;
	const basePoleHeight = 80;
	var baseHangLen = 50;
	if (isFlipped) {
		baseHangLen = -baseHangLen;
	}

	var boxGeo = new THREE.BoxGeometry(5, basePoleHeight, 5);
	var poleMat = new THREE.MeshStandardMaterial({color: 0xDDDDDD});
	boxGeo.translate(0, basePoleHeight / 2, 0);
	boxGeo.scale(scale, scale, scale);
	currentObj = new THREE.Mesh(boxGeo, poleMat);
	translateXYZ(translate, currentObj);
	g_scene.add(currentObj);

	boxGeo = new THREE.BoxGeometry(20, 4, 20);
	boxGeo.scale(scale, scale, scale);
	currentObj = new THREE.Mesh(boxGeo, poleMat);
	translateXYZ(translate, currentObj);
	g_scene.add(currentObj);
	boxGeo = null;


	baseHangLen = -baseHangLen;

	boxGeo = new THREE.BoxGeometry(baseHangLen, 5, 5);
	boxGeo.translate(baseHangLen * .4, basePoleHeight, 0);
	boxGeo.scale(scale, scale, scale);
	currentObj = new THREE.Mesh(boxGeo, poleMat);
	translateXYZ(translate, currentObj);
	g_scene.add(currentObj);

	var cylGeo = new THREE.CylinderGeometry(5, 10, 10 );
	cylGeo.translate(baseHangLen * 0.8, basePoleHeight - 5, 0);
	cylGeo.scale(scale, scale, scale);
	currentObj = new THREE.Mesh( cylGeo, poleMat );
	translateXYZ(translate, currentObj);
	g_scene.add(currentObj);

	var sphGeo = new THREE.SphereGeometry(5);
	sphGeo.translate(baseHangLen * 0.8, basePoleHeight - 10, 0 );
	sphGeo.scale(scale, scale, scale);
	var sphMat = new THREE.MeshBasicMaterial( { color: 0xEEC260} );
	currentObj = new THREE.Mesh( sphGeo, sphMat );
	translateXYZ(translate, currentObj);
	g_scene.add(currentObj);

    const light = new THREE.SpotLight(lColor, intensity);
	light.angle = Math.PI / 4;
	light.penumbra = .5;
	light.position.set(translate[0] + (baseHangLen * scale) * 0.8, translate[1] + (basePoleHeight * scale) - 15, translate[2]);
	light.target.position.set(translate[0] + (baseHangLen * scale) * 0.8, 0, translate[2]);
    g_scene.add(light);
    g_scene.add(light.target);

    
}



function translateXYZ(translation, object)
{
	object.translateX(translation[0]);
	object.translateY(translation[1]);
	object.translateZ(translation[2]);
}