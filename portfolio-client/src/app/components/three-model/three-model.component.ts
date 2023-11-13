import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {THREE} from './three-wrapper';
import {gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {ThreeModelBuilderService} from "./three-model-builder.service";
import {GLTFObjectGroup} from "./three-model";
import {ThreeModelAnimationService} from "./three-model-animation.service";

//json configuration
import * as threeModelConfig from '../../../assets/json/three-config.json';
import * as lightModeLightConfig from '../../../assets/json/lights_light-mode.json';
import * as darkModeLightConfig from '../../../assets/json/lights_dark-mode.json';
import * as materialConfig from '../../../assets/json/materials.json';
import * as interactiveMapConfig from '../../../assets/json/interactive-map.json';
import {AnimationConfigService} from "../../shared/services/animation-config.service";
import {ThreeModelWrapperService} from "./three-model-wrapper.service";
import {SharedDataProviderService} from "../../shared/services/shared-data-provider.service";
import {LightingModeService} from "../../shared/services/lighting-mode.service";


gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-three-model',
  templateUrl: './three-model.component.html',
  styleUrls: ['./three-model.component.scss'],
})
export class ThreeModelComponent implements AfterViewInit{

  showMe = false;

  showIndicators = false;

  static LIGHT_MODE_VALUE = 'light';
  lightMode = false;
  threeAnimation: ThreeModelAnimationService | undefined = undefined;

  constructor(private animationConfigService: AnimationConfigService,
              private el: ElementRef,
              private threeModelBuilderService: ThreeModelBuilderService,
              private readonly sharedDataProviderService: SharedDataProviderService,
              private lightingModeService: LightingModeService) {
    this.lightingModeService.lightingMode$.subscribe(mode => {
      this.lightMode !== (mode === ThreeModelComponent.LIGHT_MODE_VALUE) ? this.switchLightMode() : () => {};
      //this.colorHex = this.isDarkMode ? "#FFC87C" : "#7d7d7d"
    });

  }

  ngAfterViewInit(): void {
    this.showMe = this.sharedDataProviderService.showMe;

    if(!this.showMe){
      setTimeout(() => {
        const canvas = this.el.nativeElement.querySelector('#room');

        this.threeModelBuilderService.createThreeModel(canvas, threeModelConfig, this.lightMode ? lightModeLightConfig : darkModeLightConfig, materialConfig, interactiveMapConfig, this.lightMode);

        this.threeModelBuilderService.getThreeModel().getRenderer().setSize(window.innerWidth, window.innerHeight);
        this.threeModelBuilderService.getThreeModel().getRenderer().setPixelRatio(window.devicePixelRatio);
        this.threeModelBuilderService.getThreeModel().getRenderer().toneMapping = THREE.NoToneMapping;
        this.threeModelBuilderService.getThreeModel().getLights().map((value: any, index: number) => {
          if (this.threeModelBuilderService.getThreeModel()) {
            this.threeModelBuilderService.getThreeModel().getScene().add(value);
          }
        });

        this.threeAnimation = ThreeModelWrapperService.getInstance(this.threeModelBuilderService, [this.threeModelBuilderService.getThreeModel().getScene(), this.threeModelBuilderService.getThreeModel().getCamera(), this.threeModelBuilderService.getThreeModel().getRenderer(), this.animationConfigService]).threeModelAnimationService;

        this.threeAnimation.populateAnimationSuppliers(this.redraw)
        this.threeAnimation.onMouseClick(this.threeModelBuilderService.getThreeModel().getCamera(), this.threeModelBuilderService.getThreeModel().getScene(), this.threeModelBuilderService.getInteractiveGeometries(), materialConfig, this.redraw, this.beforeAnimation.bind(this), this.afterAnimation.bind(this));
        this.threeAnimation.animate();
        this.threeAnimation.onResize();
        this.threeAnimation.animateCamera(1, true, () => null, this.afterAnimation.bind(this));
      }, 2000);
    }
  }

  afterAnimation(animationId?: number) {
    if (animationId === 1) {
      if (this.threeAnimation) {
        this.threeAnimation.onMouseMove.bind(this);
      }
      this.showIndicators = true;

    }
    if (animationId === 2) {
      this.showIndicators = false
      this.sharedDataProviderService.showMe = true ;
      this.showMe = this.sharedDataProviderService.showMe;
      //this.router.navigate(['/me']);
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
    if (this.threeAnimation) {
      this.threeAnimation.removeMouseMove();
      this.threeAnimation.animateCamera(3, false, this.beforeAnimation.bind(this), this.afterAnimation.bind(this));
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
