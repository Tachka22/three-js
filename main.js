import * as THREE from "https://unpkg.com/three/build/three.module.js"; 

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.shadowMap.enabled = true;


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

// Camera
let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1, 5);

const scene = new THREE.Scene();

// Плоскость
let floorVertices = [0, 0, 0, 10, 0, 0, 10, 0, 10, 0, 0, 10];
let floorIndices = [2, 1, 0, 0, 3, 2];
let floorGeometry = new THREE.BufferGeometry();
floorGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(floorVertices), 3)
);
floorGeometry.setIndex(floorIndices);
floorGeometry.computeVertexNormals();
let floorMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.position.set(-5, 0, -5);
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// Вернтикальнfz стенка
let wallMesh = new THREE.Mesh(floorGeometry, floorMaterial);
wallMesh.position.set(-5, 7,-3);
const angle = Math.PI/2;
wallMesh.rotation.set(angle , 0, 0);
wallMesh.receiveShadow = true;
scene.add(wallMesh);

// Точечный направленный свет спереди
const spotLight = new THREE.SpotLight("#ffffff");
spotLight.position.set(0, 2, 5);
spotLight.castShadow = true;
spotLight.intensity = 2;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 25;
spotLight.shadow.bias = -0.01;
spotLight.target.position.set(0, 0, 0);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLight);
scene.add(spotLight.target);
scene.add(spotLightHelper);

// Свет СЛЕВА
const directionalLightL = new THREE.DirectionalLight("#ffffff");
directionalLightL.position.set(-5, 1, -3);
directionalLightL.castShadow = true;
directionalLightL.intensity = 2 
directionalLightL.shadow.camera.near = 1;
directionalLightL.shadow.camera.far = 25;
directionalLightL.shadow.bias = -0.01;
directionalLightL.target.position.set(0, 0, 0); 
const directionalLightLHelper = new THREE.DirectionalLightHelper(directionalLightL);
scene.add(directionalLightL);
scene.add(directionalLightL.target);
scene.add(directionalLightLHelper);

// Свет ПРАВЫЙ
const directionalLightR = new THREE.DirectionalLight("#ffffff");
directionalLightR.position.set(5, 1, -3);
directionalLightR.castShadow = true;
directionalLightR.intensity = 2
directionalLightR.shadow.camera.near = 1;
directionalLightR.shadow.camera.far = 25;
directionalLightR.shadow.bias = -0.01;
directionalLightR.target.position.set(0, 0, 0);

const directionalLightRHelper = new THREE.DirectionalLightHelper(directionalLightR);
scene.add(directionalLightR);
scene.add(directionalLightR.target);
scene.add(directionalLightRHelper);

// Сфера
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 0.5;
sphere.position.x = 0.5;
sphere.receiveShadow = true;
sphere.castShadow = true;
scene.add(sphere);

// Тетраидер
let len = 1;
let vert_arr = [0, 0, 0, 0, 0, len, (Math.sqrt(3)*len/2), 0, len/2, (Math.sqrt(3)*len/6), len, len/2];
const indices = [0, 1, 2, 0, 1, 3, 1, 2, 3, 0, 2, 3];
let myMesh = new THREE.BufferGeometry();
myMesh.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vert_arr), 3));
myMesh.setIndex(indices);
myMesh.computeVertexNormals();
let matTetraider = new THREE.MeshPhongMaterial({ color: 'aqua', side: THREE.DoubleSide });
let tetraider = new THREE.Mesh(myMesh, matTetraider);
tetraider.position.set(-1, 0, -0.5);
tetraider.castShadow = true;
tetraider.receiveShadow = true;
scene.add(tetraider);


renderer.render(scene,camera);

function render(time){

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    time *= 0.0005;

    renderer.render(scene,camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

document.forms[0].addEventListener("change", (event) => {
    if (event.target.name == "color_sphere") {
        sphereMaterial.color.set(event.target.value);
    } else
    if (event.target.name == "color_tet") {
        matTetraider.color.set(event.target.value);
    } else
    if (event.target.name == "light_left") {
        directionalLightL.intensity = event.target.checked ? 2 : 0;
    } else
    if (event.target.name == "light_center") {
        spotLight.intensity = event.target.checked ? 2 : 0;
    } else
    if (event.target.name == "light_right") {
        directionalLightR.intensity = event.target.checked ? 2 : 0;
    }
})