import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export interface Animation {
  animationId: number;
  duration: number;
  path: number[][];
  target: number[];
  repeat: number;
  numPoints: number;
  ease: string;
  delay: number;
}

export interface AnimationConfig {
  animations: Animation[];
}


export type InteractiveGeometry = {
  mesh : string,
  children : string[]
}
export class ThreeModel {
  private static instance: ThreeModel;

  public constructor(private renderer: THREE.WebGLRenderer, private camera: THREE.Camera, private scene: THREE.Scene, private lights: THREE.Light[],
                     private geometry: GLTFLoader, private materials : THREE.Material[]) {}

  public static getInstance(renderer: THREE.WebGLRenderer, camera: THREE.Camera, scene: THREE.Scene, lights: THREE.Light[],
                            geometry: GLTFLoader, material : THREE.Material[]): ThreeModel {
    if (!ThreeModel.instance) {
      // Construct the ThreeModel using the Builder pattern
      const builder = new ThreeModelBuilder();
      ThreeModel.instance = builder
        .setRenderer(renderer)
        .setCamera(camera)
        .setScene(scene)
        .setLights(lights)
        .setGeometry(geometry)
        .setMaterials(material)
        .build();
    }
    return ThreeModel.instance;
  }
  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public getCamera(): THREE.Camera {
    return this.camera;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getLights(): THREE.Light[] {
    return this.lights;
  }

  public getGeometry(): GLTFLoader {
    return this.geometry;
  }

  public getMaterials(): THREE.Material[] {
    return this.materials;
  }

  // Other methods related to ThreeModel
}

export class ThreeModelBuilder {
  private renderer?: THREE.WebGLRenderer;
  private camera?: THREE.Camera;
  private scene?: THREE.Scene;
  private lights?: THREE.Light[] | any;
  private geometry?: GLTFLoader | any;
  private materials?: THREE.Material[] | any;
  setRenderer(renderer: THREE.WebGLRenderer): ThreeModelBuilder {
    this.renderer = renderer;
    return this;
  }

  setCamera(camera: THREE.Camera): ThreeModelBuilder {
    this.camera = camera;
    return this;
  }

  setScene(scene: THREE.Scene): ThreeModelBuilder {
    this.scene = scene;
    return this;
  }

  setGeometry(geometry: GLTFLoader): ThreeModelBuilder {
    this.geometry = geometry;
    return this;
  }

  setLights(lights: THREE.Light[]): ThreeModelBuilder {
    this.lights = lights;
    return this;
  }

  setMaterials(materials: THREE.Material[]): ThreeModelBuilder {
    this.materials = materials;
    return this;
  }

  build(): ThreeModel {
    if (!this.renderer || !this.camera || !this.scene || !this.lights || !this.geometry || !this.materials) {
      throw new Error('ThreeModel is not fully configured');
    }
    return new ThreeModel(this.renderer, this.camera, this.scene, this.lights, this.geometry, this.materials);
  }
}
