import {ThreeModelBuilderService} from "./three-model-builder.service";
import {ThreeModelAnimationService} from "./three-model-animation.service";

export class ThreeModelWrapperService {

  static instance: ThreeModelWrapperService | undefined;

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

  static getInstance(threeModelBuilderService: ThreeModelBuilderService, args: any[]): ThreeModelWrapperService {
    if (!this.instance) {
      this.instance = new ThreeModelWrapperService(threeModelBuilderService, this.buildThreeModelAnimationService(args))
    }
    return this.instance
  }

  static buildThreeModelBuilderService(): ThreeModelBuilderService {
    return new ThreeModelBuilderService();
  }

  static buildThreeModelAnimationService(args: any[]): ThreeModelAnimationService {
    const [scene, camera, renderer, animationConfigService] = args;
    return new ThreeModelAnimationService(scene, camera, renderer, animationConfigService);
  }
}
