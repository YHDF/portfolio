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
    //const gui = new dat.GUI();
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
    renderer.toneMappingExposure = 1.5; //Not available for "NoToneMapping"
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type to PCFSoftShadowMap

    scene.environment = null;

    // Create dynamic menu texture

    function makeLabelCanvas(size : any, name : any) {
      let menuCanvas = document.createElement('canvas');
      menuCanvas.width = 512;
      menuCanvas.height = 512;
      let ctx : any = menuCanvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
      ctx.save();
      ctx.scale(1, -1);
      ctx.translate(0, -menuCanvas.height);
      ctx.font = '100px Arial';
      ctx.fontWeight = '900'
      ctx.fillStyle = 'black';
      ctx.fillText('Option 1', 50, 100);
      ctx.fillText('Option 2', 50, 250);
      ctx.restore();
      return ctx.canvas;
    }
    const cnvs = makeLabelCanvas(3, "text");
    let menuTexture = new THREE.CanvasTexture(cnvs);
    menuTexture.needsUpdate = true;
    menuTexture.minFilter = THREE.LinearFilter;
    menuTexture.wrapS = THREE.ClampToEdgeWrapping;
    menuTexture.wrapT = THREE.ClampToEdgeWrapping;
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: menuTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const labelGeometry = new THREE.PlaneGeometry(1, 1);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);

    const loader = new GLTFLoader();

    // Load the GLTF model for the room
    loader.load('./assets/3d-models/room.gltf', (gltf) => {
      const objects = gltf.scene;
      scene.add(objects);

      objects.traverse((object: any) => {
        if (!["DirectionalLight", "PointLight", "SpotLight"].includes(object.type)) {
          object.castShadow = true;
          object.receiveShadow = true;
          if (object.name === 'Cube002_1' && object.isMesh) {
            object.material = labelMaterial;
            // Perform the necessary actions here
            // such as opening the menu or changing the texture
          }
        }
      });
    }, undefined, function (error) {
      console.error(error);
    });



    // Load the GLTF model for lights
    loader.load('./assets/3d-models/lights.gltf', (gltf) => {
      const lights = gltf.scene;
      scene.add(lights);
      lights.traverse((object: any) => {
        if([, "PointLight_2", "PointLight_16"].includes(object.name)  ){
          object.distance = 2;
        }

        if(["PointLight_4",  "PointLight_6", "PointLight_8", "PointLight_10", "PointLight_12"].includes(object.name)){
          object.distance = 5;
          object.intensity = 2;
        }
        //new light configuration
        if(["PointLight"].includes(object.name)){
          object.intensity = .1;
          object.distance = 2;
        }
        if([, "PointLight_2"].includes(object.name)  ){
          object.intensity = .1;
          object.distance = 15;

        }
        if(["PointLight_4"].includes(object.name)){
          object.intensity = 4;
          object.distance = 2.5;
        }
        if(["PointLight_6"].includes(object.name)){
          object.intensity = 5;
          object.distance = 2.5;
        }
        if(["PointLight_8"].includes(object.name)){
          object.intensity = 4;
          object.distance = 2.5;
        }
        if(["PointLight_10"].includes(object.name)){
          object.intensity = .5;
          object.distance = 4;
        }
        if(["PointLight_12"].includes(object.name)){
          object.intensity = 1;
          object.distance = 4;
        }
        if(object.name === "PointLight_14"){

          object.intensity = .1;
          object.distance = 0;
          object.castShadow = true;
          object.shadow.mapSize.width = 2048; // Lower resolution
          object.shadow.mapSize.height = 2048; // Lower resolution
          object.shadow.bias = -0.0001;
          object.shadow.camera.near = .1;
          object.shadow.camera.far = 100;
          object.shadow.camera.fov = 90;

          object.shadow.camera.left = -5;
          object.shadow.camera.right = 5;
          object.shadow.camera.top = 5;
          object.shadow.camera.bottom = -5;
        }
        if([, "PointLight_16"].includes(object.name)  ){
          object.intensity = 1;
          object.distance = 10;
        }
        if([, "PointLight_18"].includes(object.name)  ){
          object.intensity = .5;
          object.distance = 15;
        }
      });
    }, undefined, function (error) {
      console.error(error);
    });

    // Create an instance of OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(-2.56422113485508, 4.526892511965737,-1.4689992669423708)

    // Configure the controls (optional)
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event : any) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let i = 0; i < intersects.length; i++) {
        console.log(intersects[i].object.name)
        const intersection  : any = intersects[i].object;
        if (intersection.name === 'Cube002_1' && intersection.isMesh) {
          console.log("clicked")
          // Perform the necessary actions here
          // such as opening the menu or changing the texture
        }
      }
    }

    window.addEventListener('click', onMouseClick, false);

    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }
}
