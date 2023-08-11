import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {ThreeModelConfigService} from "../shared/three-model-config.service";
import {InteractiveGeometry, ThreeModel} from "./three-model";
import {LightConfigService} from "../shared/light-config.service";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {MaterialConfigService} from "../shared/material-config.service";

/*
       To remove if betetr solution is found
     */

const canvasWidth = 512;
const canvasHeight = 512;
const rectX = canvasWidth * 0.2; // 20% of the canvas width
const rectY = canvasHeight * 0.2; // 20% of the canvas height
const rectWidth = canvasWidth * 0.2; // 20% of the canvas width
const rectHeight = canvasHeight * 0.1; // 10% of the canvas height
let labelMesh: any; // Declare this variable at the top of your component
/*
   To remove if betetr solution is found
 */







//const labelGeometry = new THREE.PlaneGeometry(1, 1);
//const label = new THREE.Mesh(labelGeometry, labelMaterial);

@Injectable({
  providedIn: 'root',
})

export class ThreeModelBuilderService {

  private interactiveGeometries : InteractiveGeometry[] = [];
  createScene(sceneConfig: any): THREE.Scene {
    const scene = new THREE.Scene();
    ThreeModelConfigService.applyProperties(scene, sceneConfig);
    return scene;
  }

  createCamera(cameraConfig: any): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    ThreeModelConfigService.applyProperties(camera, cameraConfig);
    return camera;
  }

  createRenderer(element: HTMLElement, rendererConfig: any): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: element});
    ThreeModelConfigService.applyProperties(renderer, rendererConfig);
    return renderer;
  }

  createLights(lightConfig: any): THREE.Light[] {
    return LightConfigService.createLightsFromConfig(lightConfig);
  }

  createGeometry(scene: THREE.Scene, materials : THREE.Material[], materialConfig : any, interactiveGeometries : any[]): GLTFLoader {
    //    MaterialConfigService.getMaterialParentObjects(materialConfig);
    const loader = new GLTFLoader();

    // Load the GLTF model for the room
    loader.load('./assets/3d-models/room.gltf', (gltf) => {
      const objects = gltf.scene;
      scene.add(objects);
      objects.traverse((object: any) => {
        if (!["DirectionalLight", "PointLight", "SpotLight"].includes(object.type)) {
          object.castShadow = true;
          object.receiveShadow = true;
            for (let i = 0; i < interactiveGeometries.length; i++ ){
              if (object.name === interactiveGeometries[i].mesh && object.isMesh) {
                object.material = materials[i];
                labelMesh = object; // Store the mesh
                const geometry: InteractiveGeometry = {
                  mesh: object.name,
                  children: interactiveGeometries[i].interactiveChildren,
                };
                this.interactiveGeometries.push(geometry);
                // Perform the necessary actions here
                // such as opening the menu or changing the texture
              }
            }
        }
      });
    }, undefined, function (error) {
      console.error(error);
    });
    return loader
  }


  createMaterials(materialConfig : any): THREE.Material[] {
    const materials : THREE.Material[] = [];
    const canvases = new MaterialConfigService().createMaterialsFromConfig(materialConfig);
    canvases.map((value, index) => {
      let menuTexture = new THREE.CanvasTexture(value);
      menuTexture.flipY = false;
      menuTexture.needsUpdate = true;
      menuTexture.minFilter = THREE.LinearFilter;
      menuTexture.wrapS = THREE.ClampToEdgeWrapping;
      menuTexture.wrapT = THREE.ClampToEdgeWrapping;
      materials.push(new THREE.MeshBasicMaterial({
        map: menuTexture,
        side: THREE.DoubleSide,
        transparent: false,
      }))

    })
    return materials;
  }

  makeLabelCanvas() {
    let menuCanvas = document.createElement('canvas');
    menuCanvas.width = 512;
    menuCanvas.height = 512;

    let ctx: any = menuCanvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#40a3ff';
    ctx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);


    // draw logo
    ctx.fillStyle = "#FD0";
    ctx.fillRect(menuCanvas.width / 2 - 50, menuCanvas.height / 2 - 50, 50, 50);
    ctx.fillStyle = "#6C0";
    ctx.fillRect(menuCanvas.width / 2, menuCanvas.height / 2 - 50, 50, 50);
    ctx.fillStyle = "#09F";
    ctx.fillRect(menuCanvas.width / 2 - 50, menuCanvas.height / 2, 50, 50);
    ctx.fillStyle = "#F30";
    ctx.fillRect(menuCanvas.width / 2, menuCanvas.height / 2, 50, 50);

    // set transparency value
    ctx.globalAlpha = 1;


    // Define the taskbar size and position
    const taskbarHeight = 40;
    const taskbarY = menuCanvas.height - taskbarHeight;

    // Draw the taskbar background
    ctx.fillStyle = '#FFF'; // Color of the taskbar
    ctx.fillRect(0, taskbarY, menuCanvas.width, taskbarHeight);


    // Draw some example icons on the taskbar
    const iconSize = 30;
    const iconSpacing = 10;
    for (let i = 0; i < 5; i++) {
      const iconX = iconSpacing + (iconSize + iconSpacing) * i;
      const iconY = taskbarY + (taskbarHeight - iconSize) / 2;

      // Draw icon rectangle (replace this with an actual icon image if needed)
      ctx.fillStyle = '#444';
      ctx.fillRect(iconX, iconY, iconSize, iconSize);

      // Optional: Add a label for the icon
      /*ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(`Icon${i}`, iconX, iconY + iconSize + 12);*/
    }


    //ading an icon on the desktop
    ctx.fillStyle = '#0e1a29';
    //ctx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);

    // Define the rectangle's position and size
    ctx.fillStyle = 'red';
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);


    return ctx.canvas;
  }

  getInteractiveGeometries() : InteractiveGeometry[] {
    return this.interactiveGeometries;
  }

  createThreeModel(element: HTMLElement, threeModelConfig: any, lightConfig: any, materialConfig : any, interactiveMeshesConfig : any): ThreeModel {
    const scene = this.createScene(threeModelConfig.scene);
    const camera = this.createCamera(threeModelConfig.camera);
    const renderer = this.createRenderer(element, threeModelConfig.renderer);
    const lights = this.createLights(lightConfig);
    const materials = this.createMaterials(materialConfig);
    const geometry = this.createGeometry(scene, materials, materialConfig, interactiveMeshesConfig.interactiveMap);

    return ThreeModel.getInstance(renderer, camera, scene, lights, geometry, materials);
  }
}
