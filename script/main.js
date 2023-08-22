import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import GUI from "lil-gui";
// import glslify from "rollup-plugin-glslify";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x0687f9);//
// renderer.setClearColor(0x000000);//
// renderer.setSize( 500, 500 );

const gl = document.querySelector("#gl-container");


// 光源の設定
const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(0, 1, 4);
// scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(0, 2, 4);
scene.add(directionalLight);

const directionalLightHelper = new THREE.PointLightHelper(directionalLight,1);
scene.add(directionalLightHelper);


const pointLightHelper = new THREE.PointLightHelper(pointLight,1);
// scene.add(pointLightHelper);

gl.appendChild(renderer.domElement);

// document.body.appendChild( renderer.domElement );

//<テキストジオメトリーの表示>
const loader = new FontLoader();
// const material = new THREE.MeshNormalMaterial(
// 	{
// 		side:THREE.DoubleSide
// 	}
// );

// const material = new THREE.ShaderMaterial({
// 	vertexShader:vertexShader,
// 	fragmentShader:fragmentShader,
// 	// wireframe:true,
// 	uniforms:{
// 		colorR:{value:0.0},
// 		colorG:{value:0.0},
// 		colorB:{value:0.0},
// 		alpha:{value:1.0},
// 		progress:{value:0.0}
// 	}
// });

// const material = new THREE.LineDashedMaterial({
// 	color: 0xff00ff,
// 	linewidth: 10,
// 	scale: 1,
// 	dashSize: 10,
// 	gapSize: 1,
// });

const material = new THREE.MeshStandardMaterial({
	color:0xffffff,
	// roughness:1,
	// metalness:0.2
})

const geometry = [];

loader.load( './fonts/helvetiker_regular.typeface.json', function ( font ) {

	function setupGeometry(){
		const textGeometry = new TextGeometry( 'Hello', {
			font: font,
			size: 1,
			height: 1,
			curveSegments: 20,
			bevelEnabled: true,
			bevelThickness: 0.01,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 50
		} );
		
		// const delayVertices = [];
		
		// const maxCount = textGeometry.attributes.aDelay.array[0].length;
		// const maxCount = textGeometry.attributes.position.array[1].length;
		// for(let i = 0;i < maxCount; i++){
		// 	const delayDuration = (1/maxCount) * i;
		// 	delayVertices.push(delayDuration);
		// }
		
		
		// textGeometry.setAttribute("aDelay", new THREE.Float32BufferAttribute(delayVertices, 1));
		
		return textGeometry;
	}
	
	const textGeometry = setupGeometry();
	// console.log(maxCount);
	// console.log(delayVertices);
	// console.log(textGeometry);
	// window.geometry = textGeometry;

	// const textGeometry = new TextGeometry( 'Hello', {
	// 	font: font,
	// 	size: 1,
	// 	height: 1,
	// 	curveSegments: 20,
	// 	bevelEnabled: true,
	// 	bevelThickness: 0.01,
	// 	bevelSize: 0.01,
	// 	bevelOffset: 0,
	// 	bevelSegments: 50
	// } );
	textGeometry.center();
	const text = new THREE.Mesh( textGeometry, material );
	geometry.push(text);
	text.name = "text";
	text.position.x = -2.0;
	scene.add( text );

	// <スキルジオメトリーの表示>
	const skillGeometry = new TextGeometry( 'Skill', {
			font: font,
			size: 1,
			height: 1,
			curveSegments: 20,
			bevelEnabled: true,
			bevelThickness: 0.01,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 50
		} );

		const skill = new THREE.Mesh( skillGeometry, material);
		geometry.push(skill);
		skill.name = "skill";
		skill.position.x = 0.5;
		skill.position.y = -0.5;
		scene.background = blur;
		scene.add( skill);

	} );
	
//<各オブジェクトをクリックするとリンクに飛ぶ>

//<Raycastingの実装>
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycast();
}

function raycast() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	// console.log(intersects);

	
	for ( let i = 0; i < intersects.length; i ++ ) {
		
		// intersects[ i ].object.material.color.set( 0xff0000 );
		// console.log(intersects[0].object.name);
		if(intersects[i].object.name === "text"){
			// console.log("text");
			console.log(intersects[i].object);
			window.open("https://www.google.com");
		}
		if(intersects[i].object.name === "skill"){
			// console.log("skill")
			console.log(intersects[i].object);
			window.open("https://www.yahoo.co.jp/");
		}
		// if(intersects[i].object.name !== "text"|"skill"){
		// 	console.log("null");
		// }
	}

}

//雲の表現
initCloud();
async function initCloud(){
	//ジオメトリー
	const cloudGeometry = new THREE.PlaneGeometry(50, 50);
	// const cloudGeometry = new THREE.texture
	
	//マテリアル
	const cloudMaterial = new THREE.MeshBasicMaterial();
	// const cloudMaterial = new THREE.ShaderMaterial({
	// 	vertexShader:vertexShader,
	// 	fragmentShader:fragmentShader
	// });

	const texLoader = new THREE.TextureLoader();
	const texture = await texLoader.loadAsync('/portfolio-webgl/image/cloud.jpg');
	const material = new THREE.MeshBasicMaterial({map:texture});
	// return material
	// メッシュ
	// const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
	const cloud = new THREE.Mesh(cloudGeometry, material);
	
	// console.dir(cloud);
	cloud.rotation.x = -1.5;
	cloud.position.y= -1;
	
	scene.add(cloud);
}



//<オービットコントロールズの実装>
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

//＜lil-gui＞の実装
// const gui = new GUI();
// gui.add(material.uniforms.colorR, "value", 0, 1, 0.01).name("colorR");
// gui.add(material.uniforms.colorG, "value", 0, 1, 0.01).name("colorG");
// gui.add(material.uniforms.colorB, "value", 0, 1, 0.01).name("colorB");
// gui.add(material.uniforms.alpha, "value", 0, 1, 0.01).name("alpha");
// gui.add(material.uniforms.progress, "value", 0, 1, 0.01).name("progress");
console.log(geometry);

//画面への描画
function animate() {
	requestAnimationFrame( animate );
	
	// raycast();
	renderer.render( scene, camera );
	// camera.position.z -= 0.001;
	// skill.position.z += 0.01;
}
animate();
// raycast;
window.addEventListener( 'click', onPointerMove );
