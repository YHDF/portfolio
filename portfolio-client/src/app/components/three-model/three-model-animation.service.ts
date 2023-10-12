import {Injectable} from '@angular/core';
import {THREE} from './three-wrapper';
import {gsap} from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {AnimationFunctionSupplier, InteractiveGeometry} from "./three-model";
import {MaterialConfigService} from "../../shared/services/material-config.service";
import {AnimationConfigService} from "../../shared/services/animation-config.service";

@Injectable({
  providedIn: 'root'
})
export class ThreeModelAnimationService {
  private controls?: OrbitControls;
  private boundMouseMoveListener: any;
  constructor(private readonly scene: THREE.Scene, private readonly camera: THREE.Camera, private readonly renderer: THREE.WebGLRenderer, private readonly animationConfigService: AnimationConfigService) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.boundMouseMoveListener = (event : any) => this.updateCameraPosition(event);
    // Set up orbit controls
    //this.initControls();
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

  onMouseMove() {
    window.addEventListener('mousemove', this.boundMouseMoveListener, false);
  }

  removeMouseMove() {
    window.removeEventListener('mousemove', this.boundMouseMoveListener);
  }


  onMouseClick(camera : THREE.Camera, scene :THREE.Scene, meshes : InteractiveGeometry[], materialConfig : any, __callback : (parentObject : string, onInit? : boolean) => THREE.Material[], __toggleCallback : () => void ){
    window.addEventListener('click', (evt) => this.calculateIntersects.apply(this, [evt, camera, scene, this.findInteractiveIcons(meshes, materialConfig.materials), __callback, __toggleCallback]), false);
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
          const x = uv!.x * 1366; // Canvas width
          const y = uv!.y * 768; // Canvas height
          const materialConfigService = new MaterialConfigService();
          const parentWidth = 1366;
          const parentHeight = 768;
          const rectX = materialConfigService.evalValue(icons[j].childrenConfig.position.x, {parentWidth})
          const rectY = materialConfigService.evalValue(icons[j].childrenConfig.position.y, {parentHeight})
          const rectWidth = materialConfigService.evalValue(icons[j].childrenConfig.dimensions.width, {parentWidth})
          const rectHeight = materialConfigService.evalValue(icons[j].childrenConfig.dimensions.height, {parentHeight})
          // Check if the click was inside the rectangle
          if (x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight) {
            const animationFunctions = AnimationFunctionSupplier.getInstance();
            let executionValue = null;
            if(icons[j].childrenConfig.properties.type === "_CUSTOM_ICON_"){
               executionValue = animationFunctions.execSupplier(icons[j].childrenConfig.properties.name, this, [intersection.name, 2, false, __toggleCallback]);
            }else {
              executionValue = animationFunctions.execSupplier(icons[j].childrenConfig.properties.name, this, Object.values(icons[j].childrenConfig.properties.params));
            }
            if(executionValue){
              intersection.material = executionValue
            }
          }
        }
      }
    }
  }

  animate() {
    // Animation loop logic goes here
    requestAnimationFrame(() => this.animate());
    // Update the 3D model or any other objects here
    //this.controls!.update();
    this.renderer.render(this.scene, this.camera);
  }


  updateCameraPosition(event: any) {
    const target = new THREE.Vector3(-11, 2, -4);

    const mouseMoveTarget = new THREE.Vector3(-5, 4, -2)
    const radius = 5; // Radius of the circle
    const angleFactor = .05; // Factor to reduce the range of angles, making movement slower
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

  animateCamera(animationId: number, enableMouseMove : boolean, __toggleCallback? : () => void) {
    this.animationConfigService.animateCamera(gsap, this.camera, animationId, this.updateControls.bind(this), this.onMouseMove.bind(this), enableMouseMove, __toggleCallback?.bind(this));
  }

  updateControls(target : THREE.Vector3) {
    this.camera.lookAt(target)
    //this.controls!.target = target;
  }

  populateAnimationSuppliers(__callback: (parentObject : string, onInit? : boolean) => THREE.Material[] ){
    const animationFunctions = AnimationFunctionSupplier.getInstance();
    const animationKeys : string[] = ["MeAnimation", "visitLinkedIn", "visitGithub"]
    const animationSuppliers : ((...args : any) => any)[] = [
      (intersectionName : string, animationId : number, enableMouseMove : boolean, __toggleCallback : () => void) => {
        this.removeMouseMove();
        this.animateCamera(animationId, enableMouseMove, __toggleCallback);
        return __callback.apply(this, [intersectionName])[0];
      },
      (url, target) => {
        window.open(url, target);
      },
      (url, target) => {
        window.open(url, target);
      }
    ]
    animationFunctions.populateTuple(animationKeys, animationSuppliers);
  }
}