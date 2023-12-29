import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
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
export class ThreeModelComponent implements AfterViewInit, OnDestroy {
  static LIGHT_MODE_VALUE = 'light';
  @Input()
  showMe = false;
  @ViewChild('threeModelCanvasContainer') threeModelCanvasContainer!: ElementRef;
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
    if (!this.showMe) {
      const {scene, camera, lights, materials, geometry} = this.sharedDataProviderService?.threeModelBuilder
      const interactiveIcons = this.sharedDataProviderService?.interactiveIcons;
      if(!this.sharedDataProviderService.canvas){
        this.sharedDataProviderService.canvas = this.el.nativeElement.querySelector('#room')
      }else{
        this.el.nativeElement.querySelector('#room').remove()
        this.threeModelCanvasContainer.nativeElement.appendChild(this.sharedDataProviderService.canvas);
      }
      new Promise(async (resolve, reject) => {
        this.threeModelWrapperService = await ThreeModelWrapperService.getInstance(this.threeModelBuilderService, [this.sharedDataProviderService.canvas, scene, camera, lights, geometry, materials, this.animationConfigService]);
        resolve(this.threeModelWrapperService)
      }).then((value: any) => {
        this.threeModelWrapperService!.threeModelAnimationService.populateAnimationSuppliers(this.redraw.bind(this))
        this.threeModelWrapperService!.threeModelAnimationService.onMouseClick(this.threeModelWrapperService?.threeModelBuilderService.getThreeModel().getCamera()!, this.threeModelWrapperService?.threeModelBuilderService.getThreeModel().getScene()!, interactiveIcons, materialConfig, this.beforeAnimation.bind(this), this.afterAnimation.bind(this));
        this.threeModelWrapperService!.threeModelAnimationService.animate();
        this.threeModelWrapperService!.threeModelAnimationService.onResize();
        this.threeModelWrapperService!.threeModelAnimationService.animateCamera(1, true, () => null, this.afterAnimation.bind(this));
      })
    }
  }

  ngOnDestroy() {
    ThreeModelWrapperService.destroyInstance();
    this.el.nativeElement = null;
  }

  afterAnimation(animationId?: number) {
    switch (animationId) {
      case 1:
        if (this.threeModelWrapperService!.threeModelAnimationService) {
          this.threeModelWrapperService!.threeModelAnimationService.onMouseMove.bind(this);
        }
        this.sharedDataProviderService.showIndicatorsSubject$.next(true);
        break;

      case 2:
        this.sharedDataProviderService.showIndicatorsSubject$.next(false);
        this.sharedDataProviderService.showMeSubject$.next(true)
        break;

      case 3:
      case 4:
        this.sharedDataProviderService.showIndicatorsSubject$.next(false);

        if (animationId === 4) {
          this.sharedDataProviderService.showHeaderSubject$.next(false);
        }
        break;

      default:
        break;
    }

  }

  beforeAnimation(animationId?: number) {
    switch (animationId) {
      case 2:
      case 3:
      case 4:
        this.sharedDataProviderService.showIndicatorsSubject$.next(false);
        break;

      default:
        break;
    }

  }

  redraw(parentObject: string, onInit?: boolean): THREE.Material[] {
    if (!this.threeModelWrapperService!.threeModelBuilderService) {
      this.threeModelWrapperService!.threeModelBuilderService = new ThreeModelBuilderService();
    }
    return this.threeModelWrapperService!.threeModelBuilderService.createMaterials(materialConfig, onInit, parentObject);
  }

  bindFirstScreen(){
    return this.zoomFirstScreen.bind(this)
  }

  bindSecondScreen(){
    return this.zoomSecondScreen.bind(this)
  }

  zoomFirstScreen() {
    if (this.threeModelWrapperService!.threeModelAnimationService) {
      this.threeModelWrapperService!.threeModelAnimationService.zoomIn(3, this.beforeAnimation.bind(this), this.afterAnimation.bind(this))
    }
  }

  zoomSecondScreen() {
    if (this.threeModelWrapperService!.threeModelAnimationService) {
      this.threeModelWrapperService!.threeModelAnimationService.zoomIn(4, this.beforeAnimation.bind(this), this.afterAnimation.bind(this))
    }
  }

  switchLightMode() {
    const currentLightConfig = this.lightMode ? lightModeLightConfig : darkModeLightConfig;
    this.threeModelWrapperService?.threeModelBuilderService.removeLights(currentLightConfig, this.threeModelWrapperService?.threeModelBuilderService.getThreeModel().getScene()!);
    this.lightMode = !this.lightMode;
    const lights = this.lightMode ? this.sharedDataProviderService.lightModelights : this.sharedDataProviderService.darkModelights;
    this.threeModelWrapperService?.threeModelBuilderService.addLights(lights, this.threeModelWrapperService?.threeModelBuilderService.getThreeModel().getScene()!);
    GLTFObjectGroup.getInstance().objects.traverse(object => {
      if (Object.hasOwn(object, "material")) {
        this.threeModelWrapperService?.threeModelBuilderService.applyMaterialOptionsConfiguration(object, materialConfig, this.lightMode)
      }
    })
  }



}
