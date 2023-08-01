import {Component, ElementRef} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {Vector3} from "three";

@Component({
  selector: 'app-three-model',
  templateUrl: './three-model.component.html',
  styleUrls: ['./three-model.component.scss']
})
export class ThreeModelComponent {
  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    const gui = new dat.GUI();
    const scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

    camera.position.set(-1.2384181889123687, 5.31712689604193, -0.6724911647564484 );

    const canvas = this.el.nativeElement.querySelector('#room');

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.NoToneMapping;
    //renderer.toneMappingExposure = 1.5; Not available for "NoToneMapping"
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type to PCFSoftShadowMap

    const pointLight = new THREE.PointLight(0x343a40, 1); // Lower intensity
    pointLight.position.set(-6.738, 15.080, -9.095);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048; // Lower resolution
    pointLight.shadow.mapSize.height = 2048; // Lower resolution
    pointLight.shadow.bias = -0.001;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 100;
    pointLight.shadow.camera.fov = 90;
    pointLight.distance = 50;
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    pointLightHelper.visible = true;
    scene.add(pointLight);
    //scene.add(pointLightHelper);

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load('./assets/3d-models/scene.gltf', (gltf) => {
      //console.log(gltf)
      const model = gltf.scene;
      scene.add(model);

      model.traverse((object: any) => {
        if (!["DirectionalLight", "PointLight", "SpotLight"].includes(object.type)) {
          object.castShadow = true;
          object.receiveShadow = true;
        } else {
          const objectLightHelper = new THREE.PointLightHelper(object);
          objectLightHelper.visible = true;
          //scene.add(objectLightHelper);
          //object.intensity = 2;
          console.log(object.distance)
          if(!object.distance){
            console.log(object.name);
            object.distance = 5;

          }
          if(object.name === "PointLight"){
            object.distance = 15;
            object.intensity = 2;
          }

          /*object.castShadow = true;
          object.shadow.mapSize.width = 2048; // Lower resolution
          object.shadow.mapSize.height = 2048; // Lower resolution
          object.shadow.bias = -0.001;
          object.shadow.camera.near = 0.1;
          object.shadow.camera.far = 100;
          object.shadow.camera.fov = 90;
          object.receiveShadow = false;
          object.visible = true;*/
        }
      });

      animate();
    });

    // Create an instance of OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(-2.56422113485508, 4.526892511965737,-1.4689992669423708)

    // Configure the controls (optional)
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;


    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
        //console.log(camera.position);
        //console.log(controls.target)
    };

    animate();
  }
}
