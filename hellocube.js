

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OBJExporter} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/exporters/OBJExporter.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';


window.onload = function init() { 

  // 카메라 컨트롤: https://threejsfundamentals.org/threejs/lessons/kr/threejs-cameras.html
  const canvas = document.getElementById( "gl-canvas" );
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.01;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = 25
  camera.position.y = 20
  camera.position.z = 30
  camera.lookAt(0,0,0) // 0,0,0을 향해서 봄


  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  controls.addEventListener('change', render);

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 0.7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(10, 10, 10);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 0.3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-10, 10, 10);
    scene.add(light);
  }

  
  // OBJ, MTL 로더
  const mtlLoader = new MTLLoader();
  mtlLoader.load('4.mtl', (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('4.obj', (mesh) => {  
      
      // 오브젝트 배치
      scene.add(mesh);

      // 오브젝트 Transition
      mesh.rotation.y = -Math.PI/180*90
      // mesh.scale.set(1,1,1)
      // mesh.rotation.set(0,0,0)
      renderer.render(scene, camera);
    });
  });
  


  const boxWidth = 10;
  const boxHeight = 10;
  const boxDepth = 10;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({color});
    
    const cube = new THREE.Mesh(geometry, material);
    
    scene.add(cube);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0, 0, 0),
    makeInstance(geometry, 0x8844aa, -10, 0, 0),
    makeInstance(geometry, 0xaa8844,  10, 0, 0),
  ]

  function render(time) {
    renderer.render(scene, camera);
  }

  render(render);	



  // Obj 파일 출력
  // https://stackoverflow.com/questions/19351419/exporting-threejs-scene-to-obj-format
  document.getElementById("downloadBtn").addEventListener("click", () => {
      
    var exporter = new OBJExporter();
    var objCode = exporter.parse(scene);

    // https://learngrid.tistory.com/12
    var text = 'Text to File'
    var link = document.getElementById("download")
    link.download = 'test.obj';
    var blob = new Blob([objCode], {type: 'text/plain'});
    link.href = window.URL.createObjectURL(blob);    
  })
}
