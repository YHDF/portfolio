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

    const canvas = this.el.nativeElement.querySelector('#room');

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas,
      antialias: true, // Disabled for performance
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .005;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type to PCFSoftShadowMap

    const spotLight = new THREE.SpotLight(0xffffff, 1); // Lower intensity

    gui.add(spotLight.position, 'x').min(-50).max(50)
    gui.add(spotLight.position, 'y').min(-50).max(50)
    gui.add(spotLight.position, 'z').min(-50).max(50)

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    spotLightHelper.visible = true;
    scene.add(spotLightHelper);
    spotLight.position.set(0, 20, 3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024; // Lower resolution
    spotLight.shadow.mapSize.height = 1024; // Lower resolution
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 100;
    spotLight.shadow.camera.fov = 90;
    scene.add(spotLight);

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load('./assets/3d-models/scene.gltf', (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.traverse((object: any) => {
        if (!["DirectionalLight", "PointLight"].includes(object.type)) {
          object.castShadow = true;
          object.receiveShadow = true;
        } else {
          console.log(`position : ${object.name} : ` +  object.position.x, object.position.y, object.position.z)
          object.castShadow = true;
          object.shadow.mapSize.width = 3072; // Lower resolution
          object.shadow.mapSize.height = 3072; // Lower resolution
          object.shadow.bias = -0.0001;
          object.shadow.camera.near = 0.1;
          object.shadow.camera.far = 100;
          object.shadow.camera.fov = 90;
          object.receiveShadow = false;
          object.visible = true;
        }
      });

      animate();
    });

    // Create an instance of OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Configure the controls (optional)
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;

    camera.position.set(2, 10, 7)

    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }
}
