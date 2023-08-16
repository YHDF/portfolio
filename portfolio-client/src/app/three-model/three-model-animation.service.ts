import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {AnimationConfig, InteractiveGeometry} from "./three-model";
import {MaterialConfigService} from "../shared/services/material-config.service";
import {AnimationConfigService} from "../shared/services/animation-config.service";

@Injectable({
  providedIn: 'root'
})
export class ThreeModelAnimationService {
  private controls?: OrbitControls;
  constructor(private readonly scene: THREE.Scene, private readonly camera: THREE.Camera, private readonly renderer: THREE.WebGLRenderer, private readonly animationConfigService: AnimationConfigService) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    // Set up orbit controls
    this.initControls();
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(-11, 2, -4);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.addEventListener('change', (event) => this.renderer.render(this.scene, this.camera));
  }

  onResize(){
    window.addEventListener('resize', () => {
      const camera = this.camera as THREE.PerspectiveCamera;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  onMouseMove(){
    window.addEventListener('mousemove', (event) => this.updateCameraPosition(event), false);
  }

  onMouseClick(camera : THREE.Camera, scene :THREE.Scene, meshes : InteractiveGeometry[], materials : any, __callback : (parentObject : string, onInit? : boolean, ) => THREE.Material[], __toggleCallback : () => void ){
    window.addEventListener('click', (evt) => this.calculateIntersects.apply(this, [evt, camera, scene, this.findInteractiveIcons(meshes, materials.materials), __callback, __toggleCallback]), false);
  }

  findInteractiveIcons(meshes : InteractiveGeometry[] , materials: any[]) : any[] {
    const interactiveIconsData : any[] = [];
    materials.map((value, index) => {
      meshes.map((value1, index1) => {
        if(value.parentObject === value1.mesh){
          value1.children?.map((value2, index2) => {
            interactiveIconsData.push({parentMesh : value.parentObject, childrenConfig : value.items.find((element :any)  => element?.identifier === value2)})
          })
        }
      })
    });
    return interactiveIconsData;
  }
   calculateIntersects (event: any, camera : THREE.Camera, scene : THREE.Scene, icons: any[], __callback : (parentObject : string, onInit? : boolean) => THREE.Material[], __toggleCallback : () => void) {
     const raycaster = new THREE.Raycaster();
     const mouse = new THREE.Vector2();
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let i = 0; i < intersects.length; i++) {
      const intersection: any = intersects[i].object;
      for(let j = 0; j < icons.length; j++){
        if (intersection.name === icons[j].parentMesh && intersection.isMesh) {
          // Translate 3D coordinates to 2D
          const uv = intersects[i].uv;
          const x = uv!.x * 512; // Canvas width
          const y = uv!.y * 512; // Canvas height
          const materialConfigService = new MaterialConfigService();
          const parentWidth = 512;
          const parentHeight = 512;
          const rectX = materialConfigService.evalValue(icons[j].childrenConfig.position.x, {parentWidth})
          const rectY = materialConfigService.evalValue(icons[j].childrenConfig.position.y, {parentHeight})
          const rectWidth = materialConfigService.evalValue(icons[j].childrenConfig.dimensions.width, {parentWidth})
          const rectHeight = materialConfigService.evalValue(icons[j].childrenConfig.dimensions.height, {parentHeight})
          // Check if the click was inside the rectangle
          if (x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight) {
            intersection.material = __callback.apply(this, [intersection.name])[0];
            this.animateCamera(2, __toggleCallback);
          }
        }
      }
    }
  }

  animate() {
    // Animation loop logic goes here
    requestAnimationFrame(() => this.animate());
    // Update the 3D model or any other objects here
    this.controls!.update();
    this.renderer.render(this.scene, this.camera);
  }


  updateCameraPosition(event: any) {
    const target = new THREE.Vector3(-11, 2, -4);

    const mouseMoveTarget = new THREE.Vector3(-5, 4, -2)
    const radius = 5; // Radius of the circle
    const angleFactor = 0.2; // Factor to reduce the range of angles, making movement slower
    const zMin = -4; // Minimum bound on the z-axis
    const zMax = 0;  // Maximum bound on the z-axis
    // Normalize the mouse position from -1 to 1
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;

    // Map the normalized mouse position to an angle (in radians)
    // Multiply by angleFactor to reduce the range of angles
    const angle = mouseX * Math.PI * angleFactor;

    // Calculate the camera's x and z coordinates on the circle

    let z = mouseMoveTarget.z - radius * Math.sin(angle);

    // Clamp the z coordinate to the defined bounds
    z = Math.max(zMin, Math.min(zMax, z));

    // Update the camera's position
    this.camera.position.set(this.camera.position.x, this.camera.position.y, z);

    // Keep the camera focused on the target
    this.camera.lookAt(target);

  }

  animateCamera(animationId: number, __toggleCallback? : () => void) {
    this.animationConfigService.animateCamera(gsap, this.camera, animationId, this.updateControls.bind(this), __toggleCallback);
  }

  updateControls(target : THREE.Vector3) {
    this.controls!.target = target;
  }
}
