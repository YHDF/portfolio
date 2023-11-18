import {Inject, Injectable} from '@angular/core';
import {THREE} from '../../components/three-model/three-wrapper';
import {AnimationConfig} from "../../components/three-model/three-model";
import {ANIMATION_CONFIG_TOKEN} from "../../components/three-model/animation-config.token";
import {SharedDataProviderService} from "./shared-data-provider.service";


@Injectable({
  providedIn: 'root'
})
export class AnimationConfigService {

  constructor(@Inject(ANIMATION_CONFIG_TOKEN) private readonly animationConfig: AnimationConfig, private readonly sharedDataProviderService : SharedDataProviderService) {
  }



  animateCamera(gsap: any, camera: THREE.Camera, animationId: number, __callback: (target: THREE.Vector3) => void, __mouseMoveCallback: () => void, enableMouseMove: boolean, __beforeAnimation?: (animationId?: number) => void, __afterAnimation?: (animationId?: number) => void) {

    if(animationId !== 1) this.sharedDataProviderService.showGreetingSubject$.next(false)
    __beforeAnimation?.apply(null, [animationId]);



    // GSAP animation for moving the camera
    const config = this.animationConfig!.animations.filter((animation: any) => animation['animationId'] === animationId)[0];
    const path = config.path.map((coords: number[]) => new THREE.Vector3(...coords));
    path.unshift(camera.position)
    const curve = new THREE.CubicBezierCurve3(...path);
    const points = curve.getPoints(config.numPoints);
    const target = new THREE.Vector3(...config.target);
    const delay = config.delay;
    __callback.apply(null, [target]);
    const animationOnComplete = new Promise(resolve => {
      let tl = gsap.timeline({repeat: config.repeat, delay: delay ? delay : 0, onComplete: resolve})
      for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        tl.to(camera.position, {
          duration: config.duration, x: pt.x, y: pt.y, z: pt.z, ease: config.ease, onUpdate: () => {
            camera.lookAt(target);
          }
        });
      }
    });
    animationOnComplete.then(value => {
      if(animationId === 1){
        this.sharedDataProviderService.showHeaderSubject$.next(true);
        this.sharedDataProviderService.showGreetingSubject$.next(true);
      }
      __afterAnimation?.apply(null, [animationId])
      if (enableMouseMove) __mouseMoveCallback?.apply(null, [])
    });
  }


}
