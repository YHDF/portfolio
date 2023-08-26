import {Injectable} from '@angular/core';
import { THREE } from './three-wrapper';
import {ThreeModelConfigService} from "../shared/services/three-model-config.service";
import {InteractiveGeometry, ThreeModel} from "./three-model";
import {LightConfigService} from "../shared/services/light-config.service";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {MaterialConfigService} from "../shared/services/material-config.service";

import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

@Injectable({
  providedIn: 'root',
})

export class ThreeModelBuilderService {

  private interactiveGeometries: InteractiveGeometry[] = [];

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

  createGeometry(scene: THREE.Scene, materials: THREE.Material[], materialConfig: any, interactiveMapConfig: any[]): GLTFLoader {
    //    MaterialConfigService.getMaterialParentObjects(materialConfig);

    // Instantiate a loader
    const dracoLoader = new DRACOLoader();

    // Specify path to a folder containing WASM/JS decoding libraries.
    dracoLoader.setDecoderPath('./assets/draco/');

    // Optional: Pre-fetch Draco WASM/JS module.
    dracoLoader.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Load the GLTF model for the room
    loader.load('./assets/3d-models/Room.glb', (gltf) => {
      const objects = gltf.scene;
      scene.add(objects);
      objects.traverse((object: any) => {
        if (!["DirectionalLight", "PointLight", "SpotLight"].includes(object.type)) {
          object.castShadow = true;
          object.receiveShadow = true;
          for (let i = 0; i < materialConfig.materials.length; i++) {
            if (object.name === materialConfig.materials[i].parentObject && object.isMesh) {
              console.log(object.material)
              object.material = materials[i];
              const geometry: InteractiveGeometry = {
                mesh: object.name,
                children: interactiveMapConfig[i].interactiveChildren,
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
    return loader;
  }


  createMaterials(materialConfig: any, drawOnInit?: boolean, parentObject?: string): THREE.Material[] {
    const materials: THREE.Material[] = [];
    const canvasConfig = new MaterialConfigService().createMaterialsFromConfig(materialConfig, drawOnInit);
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

  createThreeModel(element: HTMLElement, threeModelConfig: any, lightConfig: any, materialConfig: any, interactiveMapConfig: any): ThreeModel {
    const scene = this.createScene(threeModelConfig.scene);
    const camera = this.createCamera(threeModelConfig.camera);
    const renderer = this.createRenderer(element, threeModelConfig.renderer);
    const lights = this.createLights(lightConfig);
    const materials = this.createMaterials(materialConfig, true);
    const geometry = this.createGeometry(scene, materials, materialConfig, interactiveMapConfig.interactiveMap);

    return ThreeModel.getInstance(renderer, camera, scene, lights, geometry, materials);
  }
}
