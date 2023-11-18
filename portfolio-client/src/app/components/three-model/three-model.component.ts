import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {THREE} from './three-wrapper';
import {gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {ThreeModelBuilderService} from "./three-model-builder.service";
import {GLTFObjectGroup} from "./three-model";
import {AnimationConfigService} from "../../shared/services/animation-config.service";
import {ThreeModelWrapperService} from "./three-model-wrapper.service";
import {SharedDataProviderService} from "../../shared/services/shared-data-provider.service";
import {LightingModeService} from "../../shared/services/lighting-mode.service";


import * as lightModeLightConfig from '../../../assets/json/lights_light-mode.json';
import * as darkModeLightConfig from '../../../assets/json/lights_dark-mode.json';
import * as materialConfig from '../../../assets/json/materials.json';


gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-three-model',
  templateUrl: './three-model.component.html',
  styleUrls: ['./three-model.component.scss'],
})
export class ThreeModelComponent implements AfterViewInit {

  static LIGHT_MODE_VALUE = 'light';
  showMe = false;
  showThree = false;
  showIndicators = false;
  lightMode = false;
  threeModelWrapperService: ThreeModelWrapperService | undefined = undefined

  constructor(private animationConfigService: AnimationConfigService,
              private el: ElementRef,
              private threeModelBuilderService: ThreeModelBuilderService,
              private readonly sharedDataProviderService: SharedDataProviderService,
              private lightingModeService: LightingModeService) {
    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.lightMode !== (mode === ThreeModelComponent.LIGHT_MODE_VALUE) ? this.switchLightMode() : () => {
      };
    });
  }

   ngAfterViewInit(): void {
    this.showMe = this.sharedDataProviderService.showMe;
    if (!this.showMe) {
      const {scene, camera, lights, materials, geometry} = this.sharedDataProviderService?.threeModelBuilder
      const interactiveIcons = this.sharedDataProviderService?.interactiveIcons;

      const canvas = this.el.nativeElement.querySelector('#room');
      new Promise(async (resolve, reject) => {
        this.threeModelWrapperService = await ThreeModelWrapperService.getInstance(this.threeModelBuilderService, [canvas, scene, camera, lights, geometry, materials, this.animationConfigService]);
        resolve(this.threeModelWrapperService)
      }).then((value: any) => {
        this.threeModelWrapperService!.threeModelAnimationService.populateAnimationSuppliers(this.redraw)
        this.threeModelWrapperService!.threeModelAnimationService.onMouseClick(this.threeModelBuilderService.getThreeModel().getCamera(), this.threeModelBuilderService.getThreeModel().getScene(), interactiveIcons, materialConfig, this.redraw, this.beforeAnimation.bind(this), this.afterAnimation.bind(this));
        this.threeModelWrapperService!.threeModelAnimationService.animate();
        this.threeModelWrapperService!.threeModelAnimationService.onResize();
        this.threeModelWrapperService!.threeModelAnimationService.animateCamera(1, true, () => null, this.afterAnimation.bind(this));
      })
    }
  }

  afterAnimation(animationId?: number) {
    if (animationId === 1) {
      if (this.threeModelWrapperService!.threeModelAnimationService) {
        this.threeModelWrapperService!.threeModelAnimationService.onMouseMove.bind(this);
      }
      this.showIndicators = true;

    }
    if (animationId === 2) {
      this.showIndicators = false
      this.showMe = this.sharedDataProviderService.showMe = true;
    }
    if (animationId === 3) {
      this.showIndicators = false
    }
  }

  beforeAnimation(animationId?: number) {
    if (animationId === 2) {
      this.showIndicators = false
    }
    if (animationId === 3) {
      this.showIndicators = false
    }
  }

  redraw(parentObject: string, onInit?: boolean): THREE.Material[] {
    if (!this.threeModelBuilderService) {
      this.threeModelBuilderService = new ThreeModelBuilderService();
    }
    return this.threeModelBuilderService.createMaterials(materialConfig, onInit, parentObject);
  }

  zoomIn() {
    if (this.threeModelWrapperService!.threeModelAnimationService) {
      this.threeModelWrapperService!.threeModelAnimationService.removeMouseMove();
      this.threeModelWrapperService!.threeModelAnimationService.animateCamera(3, false, this.beforeAnimation.bind(this), this.afterAnimation.bind(this));
    }
  }

  switchLightMode() {
    const currentLightConfig = this.lightMode ? lightModeLightConfig : darkModeLightConfig;
    this.threeModelBuilderService.removeLights(currentLightConfig, this.threeModelBuilderService.getThreeModel().getScene()!);
    this.lightMode = !this.lightMode;
    const newLightConfig = this.lightMode ? lightModeLightConfig : darkModeLightConfig;
    this.threeModelBuilderService.addLights(newLightConfig, this.threeModelBuilderService.getThreeModel().getScene()!);
    GLTFObjectGroup.getInstance().objects.traverse(object => {
      if (Object.hasOwn(object, "material")) {
        this.threeModelBuilderService.applyMaterialOptionsConfiguration(object, materialConfig, this.lightMode)
      }
    })
  }


  toggleShowMe = (shouldShowMe: boolean) => {
    this.showMe = shouldShowMe;
  }
}
