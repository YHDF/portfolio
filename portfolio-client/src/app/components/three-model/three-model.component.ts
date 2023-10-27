import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {THREE} from './three-wrapper';
import {gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {ThreeModelBuilderService} from "./three-model-builder.service";
import {GLTFObjectGroup, ThreeModel} from "./three-model";
import {ThreeModelAnimationService} from "./three-model-animation.service";

//json configuration
import * as threeModelConfig from '../../../assets/json/three-config.json';
import * as lightModeLightConfig from '../../../assets/json/lights_light-mode.json';
import * as darkModeLightConfig from '../../../assets/json/lights_dark-mode.json';
import * as materialConfig from '../../../assets/json/materials.json';
import * as interactiveMapConfig from '../../../assets/json/interactive-map.json';
import {AnimationConfigService} from "../../shared/services/animation-config.service";


gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-three-model',
  templateUrl: './three-model.component.html',
  styleUrls: ['./three-model.component.scss']
})
export class ThreeModelComponent implements AfterViewInit {

  showMe = false;

  showIndicators = false;

  lightMode =  true;

  threeModel : ThreeModel | undefined = undefined;


  threeAnimation : ThreeModelAnimationService | undefined = undefined;

  constructor(private animationConfigService: AnimationConfigService,
              private el: ElementRef,
              private threeModelBuilderService: ThreeModelBuilderService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const canvas = this.el.nativeElement.querySelector('#room');
      this.threeModel = this.threeModelBuilderService.createThreeModel(canvas, threeModelConfig, this.lightMode ? lightModeLightConfig : darkModeLightConfig, materialConfig, interactiveMapConfig, this.lightMode)
      this.threeModel.getRenderer().setSize(window.innerWidth, window.innerHeight);
      this.threeModel.getRenderer().setPixelRatio(window.devicePixelRatio);
      this.threeModel.getRenderer().toneMapping = THREE.NoToneMapping;
      this.threeModel.getLights().map((value : any, index: number) => {
        if(this.threeModel) {
          this.threeModel.getScene().add(value);
        }
      });

      this.threeAnimation = new ThreeModelAnimationService(this.threeModel.getScene(), this.threeModel.getCamera(), this.threeModel.getRenderer(), this.animationConfigService);
      this.threeAnimation.populateAnimationSuppliers(this.redraw)
      this.threeAnimation.onMouseClick(this.threeModel.getCamera(), this.threeModel.getScene(), this.threeModelBuilderService.getInteractiveGeometries(), materialConfig, this.redraw, this.beforeAnimation.bind(this), this.afterAnimation.bind(this));
      this.threeAnimation.animate();
      this.threeAnimation.onResize();
      this.threeAnimation.animateCamera(1, true, () => null, this.afterAnimation.bind(this));
    }, 2000);
  }

  afterAnimation(animationId? : number){
    if(animationId === 1){
      if(this.threeAnimation){
        this.threeAnimation.onMouseMove.bind(this);
      }
      this.showIndicators = true;

    }
    if(animationId === 2){
      this.showIndicators = false
      this.showMe = true;
    }
    if(animationId === 3){
      this.showIndicators = false
    }
  }

  beforeAnimation(animationId? : number){
    if(animationId === 2){
      this.showIndicators = false
    }
    if(animationId === 3){
      this.showIndicators = false
    }
  }

  redraw(parentObject : string, onInit? : boolean): THREE.Material[] {
    this.threeModelBuilderService = new ThreeModelBuilderService();
    return this.threeModelBuilderService.createMaterials(materialConfig, onInit, parentObject);
  }

  zoomIn(){
    if(this.threeAnimation){
      this.threeAnimation.removeMouseMove();
      this.threeAnimation.animateCamera(3, false, this.beforeAnimation.bind(this), this.afterAnimation.bind(this));
    }
  }

  switchLightMode(){
    const currentLightConfig = this.lightMode? lightModeLightConfig : darkModeLightConfig;
    this.threeModelBuilderService.removeLights(currentLightConfig, this.threeModel?.getScene()!);
    this.lightMode = !this.lightMode;
    const newLightConfig = this.lightMode? lightModeLightConfig : darkModeLightConfig;
    this.threeModelBuilderService.addLights(newLightConfig, this.threeModel?.getScene()!);
    GLTFObjectGroup.getInstance().objects.traverse(object => {
      if(Object.hasOwn(object, "material")){
        this.threeModelBuilderService.applyMaterialOptionsConfiguration(object, materialConfig, this.lightMode)
      }
    })
  }
}
