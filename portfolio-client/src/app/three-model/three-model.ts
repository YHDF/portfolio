import * as THREE from 'three';

export class ThreeModel {
  private static instance: ThreeModel;

  public constructor(private renderer: THREE.WebGLRenderer, private camera: THREE.Camera, private scene: THREE.Scene, private lights: THREE.Light[]) {}

  public static getInstance(renderer: THREE.WebGLRenderer, camera: THREE.Camera, scene: THREE.Scene, lights: THREE.Light[]): ThreeModel {
    if (!ThreeModel.instance) {
      // Construct the ThreeModel using the Builder pattern
      const builder = new ThreeModelBuilder();
      ThreeModel.instance = builder
        .setRenderer(renderer)
        .setCamera(camera)
        .setScene(scene)
        .setLights(lights)
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

  // Other methods related to ThreeModel
}

export class ThreeModelBuilder {
  private renderer?: THREE.WebGLRenderer;
  private camera?: THREE.Camera;
  private scene?: THREE.Scene;
  private lights?: THREE.Light[] | any;

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

  setLights(lights: THREE.Light[]): ThreeModelBuilder {
    this.lights = lights;
    return this;
  }

  build(): ThreeModel {
    if (!this.renderer || !this.camera || !this.scene || !this.lights) {
      throw new Error('ThreeModel is not fully configured');
    }
    return new ThreeModel(this.renderer, this.camera, this.scene, this.lights);
  }
}
