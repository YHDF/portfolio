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

export class AnimationFunctionSupplier {
  private static instance: AnimationFunctionSupplier;

  private constructor() {
    this._data = new Map();
  }

  private _data : Map<string, (...args: any[]) => any>;

  // Getter for the data Map
  public get data() {
    return this._data;
  }

  // Setter for the data Map (Optional: depends on if you want to allow replacing the entire data map)
  public set data(newData: Map<string, (...args: any[]) => any>) {
    if (!(newData instanceof Map)) {
      throw new Error('Data must be a Map');
    }
    this._data = newData;
  }

  public static getInstance(): AnimationFunctionSupplier {
    if (!AnimationFunctionSupplier.instance) {
      AnimationFunctionSupplier.instance = new AnimationFunctionSupplier();
    }
    return AnimationFunctionSupplier.instance;
  }

  // Method to add a new entry to the tuple
  public addEntry(key : string, func: (...args: any[]) => any) {
    if (typeof key !== 'string' || typeof func !== 'function') {
      throw new Error('Key must be a string and value must be a function');
    }
    this._data.set(key, func);
  }

  // PopulateTuple method
  public populateTuple(keys : string[], funs: ((...args: any[]) => any)[]) {
    if (keys.length !== funs.length) {
      throw new Error('Keys and functions arrays must be of the same length');
    }

    for (let i = 0; i < keys.length; i++) {
      this.addEntry(keys[i], funs[i]);
    }
  }

  public execSupplier(key: string, context: any, args: any[]): Promise<any> {
    const supplierFunction = this._data.get(key);
    if (!supplierFunction) {
      throw new Error(`No supplier found for key: ${key}`);
    }
    if (typeof supplierFunction !== 'function') {
      throw new Error(`Supplier for key: ${key} is not a function`);
    }
    return new Promise((resolve, reject) => {
      resolve(supplierFunction.apply(context, args));
    }) ;
  }
}

export class GLTFObjectGroup {
  private static instance: GLTFObjectGroup | null = null;

  private constructor() {}

  private _objects?: THREE.Group;

  get objects(): THREE.Group {
    return this._objects!;
  }

  set objects(value: THREE.Group) {
    this._objects = value;
  }

  public static getInstance(): GLTFObjectGroup {
    if (GLTFObjectGroup.instance === null) {
      GLTFObjectGroup.instance = new GLTFObjectGroup();
    }
    return GLTFObjectGroup.instance;
  }
}

