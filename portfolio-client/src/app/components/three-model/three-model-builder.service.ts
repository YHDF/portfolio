import {Injectable} from '@angular/core';
import {THREE} from './three-wrapper';
import {ThreeModelConfigService} from "../../shared/services/three-model-config.service";
import {GLTFObjectGroup, InteractiveGeometry, ThreeModel} from "./three-model";
import {LightConfigService} from "../../shared/services/light-config.service";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {MaterialConfigService} from "../../shared/services/material-config.service";

import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import * as threeModelConfig from "../../../assets/json/three-config.json";

@Injectable({
  providedIn: 'root',
})

export class ThreeModelBuilderService {

  private interactiveGeometries: InteractiveGeometry[] = [];
  private materialConfigService : MaterialConfigService;

  constructor() {
    this.materialConfigService = new MaterialConfigService();
  }

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

  createGeometry(scene: THREE.Scene, materials: THREE.Material[], materialConfig: any, interactiveMapConfig: any[], islightMode: boolean): Promise<GLTFLoader> {
    return new Promise((resolve, reject) => {
      const gltfObjectGroup = GLTFObjectGroup.getInstance();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./assets/draco/');
      dracoLoader.preload();
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load('./assets/3d-models/Room.glb', (gltf) => {
        const objects = gltf.scene;
        gltfObjectGroup.objects = objects;
        scene.add(objects);
        objects.traverse((object: any) => {
          if (!["DirectionalLight", "PointLight", "SpotLight"].includes(object.type)) {
            object.castShadow = true;
            object.receiveShadow = true;

            if (object.material) {
              this.applyMaterialOptionsConfiguration(object, materialConfig, islightMode);
            }

            for (let i = 0; i < materialConfig.materials.length; i++) {
              if (object.name === materialConfig.materials[i].parentObject && object.isMesh) {
                object.material = materials[i];
                const geometry: InteractiveGeometry = {
                  mesh: object.name,
                  children: interactiveMapConfig[i].interactiveChildren,
                };
                this.interactiveGeometries.push(geometry);
              }
            }
          }
        });

        // Resolve the promise after the GLTFLoader has finished loading
        resolve(loader);
      }, undefined, function (error) {
        console.error(error);
        // Reject the promise if there's an error during loading
        reject(error);
      });
    });
  }


  applyMaterialOptionsConfiguration(object : any, materialConfig: any, islightMode: boolean){
    this.materialConfigService.applyMaterialOptionsConfiguration(object, materialConfig, islightMode)
  }

  removeLights(lightConfig: any, scene: THREE.Scene) {
    const lightsToRemove = lightConfig.lights.map((value: any) => scene.getObjectByName(value.name)!);
    scene.remove(...lightsToRemove);
  }

  createAndAddLights(lightConfig: any, scene: THREE.Scene) {
    const lightsToAdd = this.createLights(lightConfig);
    scene.add(...lightsToAdd);
  }

  addLights(lights: THREE.Light[], scene: THREE.Scene) {
    scene.add(...lights);
  }


  createMaterials(materialConfig: any, drawOnInit?: boolean, parentObject?: string): THREE.Material[] {
    const materials: THREE.Material[] = [];
    const canvasConfig = this.materialConfigService.createMaterialsFromConfig(materialConfig, drawOnInit);
    canvasConfig.filter((value) => !parentObject || value.parentObject === parentObject).map((value, index) => {
      let menuTexture = new THREE.CanvasTexture(value.canvas);
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
    });
    return materials;
  }

  getInteractiveGeometries(): InteractiveGeometry[] {
    return this.interactiveGeometries;
  }


  buildThreeModel(element: HTMLElement, scene : THREE.Scene, camera : THREE.Camera, lights : THREE.Light[], geometry?: GLTFLoader, materials? : THREE.Material[]): ThreeModel {
    if(!ThreeModel.isInstanceCreated()){
      const renderer = this.createRenderer(element, threeModelConfig.renderer);
      return ThreeModel.getInstance(renderer, camera, scene, lights, geometry, materials!);
    }
    return ThreeModel.getInstance();
  }

  getThreeModel(){
    return ThreeModel.getInstance();
  }
}
