import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const texLoader = new THREE.TextureLoader();
const cubeTexLoader = new THREE.CubeTextureLoader();
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();


let cat, cylinder, box, floor, sphere = null;

const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.set( 0, 20, 100 );
const controls = new OrbitControls(camera, renderer.domElement);

addBox();
addFloor();
addSphere();
addCylinder();
addCat();
addLight();


animate();
addSky();
addStreetLight([-80,10,0]);
addStreetLight([-80,10,-100]);
addStreetLight([-80,10,-200]);
addStreetLight([-80,10,-300]);
	
var momentum = .06;

function animate() {
	requestAnimationFrame( animate );

	box.rotation.x += 0.01;
	box.rotation.y += 0.01;

	cylinder.rotation.x -= 0.01;
	cylinder.rotation.y -= 0.01;
	if(cat != null)
	{
		cat.rotation.z += 0.01
	}
	controls.update();
	renderer.render( scene, camera );
}

function addBox()
{
	const texture = texLoader.load( 'textures/fish.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;
	const boxGeo = new THREE.BoxGeometry( 20, 20, 20 );
	const boxMat = new THREE.MeshStandardMaterial({
		color: 0xFF8844,
		map: texture,
	});
	box = new THREE.Mesh( boxGeo, boxMat );
	box.translateX(-50);
	box.translateY(30);
	box.translateZ(-50);
	scene.add( box );
}

function addFloor()
{
	const floorGeo = new THREE.BoxGeometry( 800, 20, 800 );
	const floorMat = new THREE.MeshStandardMaterial( {color: 0x0000FF} );
	floor = new THREE.Mesh( floorGeo, floorMat );
	floor.translateZ(-30);
	scene.add( floor );
}

function addCylinder()
{
	const cylGeo = new THREE.CylinderGeometry(10, 10, 40 );
	const cylMat = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
	cylinder = new THREE.Mesh( cylGeo, cylMat );
	cylinder.translateX(50);
	cylinder.translateY(40);
	scene.add( cylinder );
}

function addSphere()
{
	const sphGeo = new THREE.SphereGeometry(8);
	const sphMat = new THREE.MeshBasicMaterial( { color: 0xDDDDDD} );
	sphere = new THREE.Mesh( sphGeo, sphMat );
	sphere.translateZ(-250);
	sphere.translateY(250);
	scene.add( sphere );

	const light = new THREE.DirectionalLight(0xDDDDDD, .15);
	light.position.set(0, 250, -250);
	light.target.position.set(0, 0, 0)
	light.castShadow = true;
    scene.add(light);
	scene.add(light.target);
}

function addSky()
{
	cubeTexLoader.setPath('textures/')
	const texture = cubeTexLoader.load([
		'rightSky.png', 'leftSky.png',
		'topSky.png', 'bottomSky.png',
		'frontSky.png', 'backSky.png'
	 ]);
	scene.background = texture;
}

function addCat()
{
	mtlLoader.load('cat/12221_Cat_v1_l3.mtl', (mtl) => {
		mtl.preload();
		objLoader.setMaterials(mtl);
		objLoader.load(
			// resource URL
			'cat/12221_Cat_v1_l3.obj',
			// called when resource is loaded
			function ( object ) {
				cat = object;
				cat.translateY(10);
				cat.translateX(-25);
				cat.rotation.x = -Math.PI / 2;
				scene.add( object );
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
    scene.add(new THREE.AmbientLight(0xFFFFFF, 0.05));
}

function addStreetLight(translate)
{
	const lColor = 0xFFFFFF;
	var currentObj;
    var lIntensity = 1500;
	const poleHeight = 80;
	const hangLen = 30;

	var boxGeo = new THREE.BoxGeometry(5, poleHeight, 5);
	var boxMat = new THREE.MeshStandardMaterial({color: 0xDDDDDD});
	currentObj = new THREE.Mesh(boxGeo, boxMat);
	translateXYZ(translate, currentObj);
	currentObj.translateY(poleHeight / 2);
	scene.add(currentObj);

	boxGeo = new THREE.BoxGeometry(20, 4, 20);
	boxMat = new THREE.MeshStandardMaterial({color: 0xDDDDDD});
	currentObj = new THREE.Mesh(boxGeo, boxMat);
	translateXYZ(translate, currentObj);
	scene.add(currentObj);


	boxGeo = new THREE.BoxGeometry(hangLen, 5, 5);
	boxMat = new THREE.MeshStandardMaterial({color: 0xDDDDDD});
	currentObj = new THREE.Mesh(boxGeo, boxMat);
	translateXYZ(translate, currentObj);
	currentObj.translateY(poleHeight);
	currentObj.translateX(hangLen / 2 - .1 * hangLen);
	scene.add(currentObj);

	var cylGeo = new THREE.CylinderGeometry(5, 10, 10 );
	var cylMat = new THREE.MeshStandardMaterial( { color: 0xDDDDDD } );
	currentObj = new THREE.Mesh( cylGeo, cylMat );
	translateXYZ(translate, currentObj);
	currentObj.translateY(poleHeight - 5);
	currentObj.translateX(hangLen * 0.8);
	scene.add(currentObj);

	var sphGeo = new THREE.SphereGeometry(5);
	var sphMat = new THREE.MeshBasicMaterial( { color: 0xEEC260} );
	currentObj = new THREE.Mesh( sphGeo, sphMat );
	translateXYZ(translate, currentObj);
	currentObj.translateY(poleHeight - 10);
	currentObj.translateX(hangLen * 0.8);
	scene.add(currentObj);

	const color = 0xfff1d3;
    const intensity = 2000;
    const light = new THREE.SpotLight(color, intensity);
	light.angle = Math.PI / 4;
	light.penumbra = .5;
	light.position.set(translate[0] + hangLen * 0.8, translate[1] + poleHeight - 15, translate[2]);
	light.target.position.set(translate[0] + hangLen * 0.8, translate[1], translate[2]);
    scene.add(light);
    scene.add(light.target);

    
}

function translateXYZ(translation, object)
{
	object.translateX(translation[0]);
	object.translateY(translation[1]);
	object.translateZ(translation[2]);
}