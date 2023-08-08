import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeModelConfigService} from "../shared/three-model-config.service";
import { ThreeModel, ThreeModelBuilder} from "./three-model";
import {LightConfigService} from "../shared/light-config.service";
import * as lightConfig from "../../assets/json/lights.json";

@Injectable({
  providedIn: 'root',
})
export class ThreeModelBuilderService {
  createScene(sceneConfig : any): THREE.Scene {
    const scene = new THREE.Scene();
    ThreeModelConfigService.applyProperties(scene, sceneConfig);
    return scene;
  }

  createCamera(cameraConfig : any): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    ThreeModelConfigService.applyProperties(camera, cameraConfig);
    return camera;
  }

  createRenderer(element: HTMLElement, rendererConfig : any): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: element });
    ThreeModelConfigService.applyProperties(renderer, rendererConfig);
    return renderer;
  }

  createLights(lightConfig : any): THREE.Light[] {
    return  LightConfigService.createLightsFromConfig(lightConfig);
  }

  createThreeModel(element: HTMLElement, threeModelConfig : any, lightConfig : any): ThreeModel {
    const scene = this.createScene(threeModelConfig.scene);
    const camera = this.createCamera(threeModelConfig.camera);
    const renderer = this.createRenderer(element, threeModelConfig.renderer);
    const lights = this.createLights(lightConfig);

    return ThreeModel.getInstance(renderer, camera, scene, lights);
  }
}
