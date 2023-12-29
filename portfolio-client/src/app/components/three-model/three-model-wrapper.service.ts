import {ThreeModelBuilderService} from "./three-model-builder.service";
import {ThreeModelAnimationService} from "./three-model-animation.service";
import {THREE} from "./three-wrapper";

export class ThreeModelWrapperService {

  static instance: ThreeModelWrapperService | any;

  constructor(threeModelBuilderService: ThreeModelBuilderService, threeModelAnimationService: ThreeModelAnimationService) {
    this._threeModelBuilderService = threeModelBuilderService;
    this._threeModelAnimationService = threeModelAnimationService;
  }

  private _threeModelBuilderService: ThreeModelBuilderService;

  get threeModelBuilderService(): ThreeModelBuilderService {
    return this._threeModelBuilderService;
  }

  set threeModelBuilderService(value: ThreeModelBuilderService) {
    this._threeModelBuilderService = value;
  }

  private _threeModelAnimationService: ThreeModelAnimationService;

  get threeModelAnimationService(): ThreeModelAnimationService {
    return this._threeModelAnimationService;
  }

  set threeModelAnimationService(value: ThreeModelAnimationService) {
    this._threeModelAnimationService = value;
  }

  static async getInstance(defaultThreeModelBuilderService: ThreeModelBuilderService, args: any[]): Promise<ThreeModelWrapperService> {
    if (!this.instance) {
      await this.initThreeModel(defaultThreeModelBuilderService, args).then((instanceValue : ThreeModelWrapperService | any) => this.instance = instanceValue);
    }
    return this.instance!;
  }

  static destroyInstance(){
    this.instance = null;
  }


  static initThreeModel(defaultThreeModelBuilderService: ThreeModelBuilderService, args: any[]): Promise<ThreeModelWrapperService> {
    let {threeModelBuilderService, threeModelAnimationService}: any = {undefined};
    return new Promise((resolve, reject) => {
      threeModelBuilderService = ThreeModelWrapperService.buildThreeModelBuilderService(defaultThreeModelBuilderService, args);
      resolve(threeModelBuilderService);
    }).then((threeModelBuilderServicevalue: any) => {
      threeModelAnimationService = ThreeModelWrapperService.buildThreeModelAnimationService(threeModelBuilderServicevalue, args)
    }).then(() => {
        return new ThreeModelWrapperService(threeModelBuilderService, threeModelAnimationService);
    });
  }

  static buildThreeModelBuilderService(threeModelBuilderService: ThreeModelBuilderService, args: any[]): ThreeModelBuilderService {
    const [canvas, scene, camera, lights, geometry, materials] = args;
    threeModelBuilderService.buildThreeModel(canvas, scene, camera, lights, geometry, materials);

    threeModelBuilderService.getThreeModel().getRenderer().setSize(window.innerWidth, window.innerHeight);
    threeModelBuilderService.getThreeModel().getRenderer().setPixelRatio(window.devicePixelRatio);
    threeModelBuilderService.getThreeModel().getRenderer().toneMapping = THREE.NoToneMapping;
    threeModelBuilderService.getThreeModel().getLights().map((value: any, index: number) => {
      if (threeModelBuilderService.getThreeModel()) {
        threeModelBuilderService.getThreeModel().getScene().add(value);
      }
    });
    return threeModelBuilderService;
  }

  static buildThreeModelAnimationService(threeModelBuilderService: ThreeModelBuilderService, args: any[]): ThreeModelAnimationService {
    const scene = threeModelBuilderService.getThreeModel().getScene()!
    const camera = threeModelBuilderService.getThreeModel().getCamera()!
    const renderer = threeModelBuilderService.getThreeModel().getRenderer()!;
    const animationConfigService = args.slice(-1)[0];
    return new ThreeModelAnimationService(scene, camera, renderer, animationConfigService);
  }
}
