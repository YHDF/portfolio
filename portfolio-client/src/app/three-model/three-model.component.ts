import {Component, ElementRef} from '@angular/core';
import * as THREE from 'three';
import {gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {ThreeModelBuilderService} from "./three-model-builder.service";
import {ThreeModel} from "./three-model";
import {ThreeModelAnimationService} from "./three-model-animation.service";

//json configurtion
import * as threeModelConfig from '../../assets/json/three-config.json';
import * as lightConfig from '../../assets/json/lights.json';
import * as materialConfig from '../../assets/json/materials.json'
import * as interactiveMapConfig from '../../assets/json/interactive-map.json'

gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-three-model',
  templateUrl: './three-model.component.html',
  styleUrls: ['./three-model.component.scss']
})
export class ThreeModelComponent {
  constructor(private el: ElementRef,
              private threeModelBuilderService: ThreeModelBuilderService) {}

  ngAfterViewInit(): void {
    const canvas = this.el.nativeElement.querySelector('#room');
    const threeModel: ThreeModel = this.threeModelBuilderService.createThreeModel(canvas, threeModelConfig, lightConfig, materialConfig, interactiveMapConfig)
    threeModel.getRenderer().setSize(window.innerWidth, window.innerHeight);
    threeModel.getRenderer().setPixelRatio(window.devicePixelRatio);
    threeModel.getRenderer().toneMapping = THREE.NoToneMapping;
    threeModel.getLights().map((value, index) => {
      threeModel.getScene().add(value);
    });

    const threeAnimation = new ThreeModelAnimationService(threeModel.getScene(), threeModel.getCamera(), threeModel.getRenderer());

    threeAnimation.onMouseClick(threeModel.getCamera(), threeModel.getScene(), this.threeModelBuilderService.getInteractiveGeometries(), materialConfig, this.redraw);


    threeAnimation.animate();
    threeAnimation.onResize();
    //threeAnimation.onMouseMove()
    threeAnimation.animateCamera();

  }

  redraw(parentObject : string, onInit? : boolean): THREE.Material[] {
    this.threeModelBuilderService = new ThreeModelBuilderService();
    return this.threeModelBuilderService.createMaterials(materialConfig, onInit, parentObject);
  }
}
