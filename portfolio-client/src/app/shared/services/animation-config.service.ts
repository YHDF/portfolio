import {Inject, Injectable} from '@angular/core';
import {THREE} from '../../components/three-model/three-wrapper';
import {AnimationConfig} from "../../components/three-model/three-model";
import {ANIMATION_CONFIG_TOKEN} from "../../components/three-model/animation-config.token";


@Injectable({
  providedIn: 'root'
})
export class AnimationConfigService {

  constructor(@Inject(ANIMATION_CONFIG_TOKEN) private readonly animationConfig: AnimationConfig) {
  }

  animateCamera(gsap : any, camera: THREE.Camera, animationId : number, __callback : (target : THREE.Vector3) => void, __mouseMoveCallback : () => void, enableMouseMove: boolean, __toggleCallback? : () => void) {
    // GSAP animation for moving the camera
    const config = this.animationConfig!.animations.filter((animation : any) => animation['animationId'] === animationId )[0];
    const path = config.path.map((coords: number[]) => new THREE.Vector3(...coords));
    const curve = new THREE.CubicBezierCurve3(...path);
    const points = curve.getPoints(config.numPoints);
    const target = new THREE.Vector3(...config.target);
    const delay = config.delay;
    __callback.apply(null,[target]);
    const animationOnComplte = new Promise(resolve => {
       let tl = gsap.timeline({ repeat: config.repeat, delay: delay ? delay : 0, onComplete : resolve })
      for (let i = 0; i < points.length; i++) {
        let pt = points[i];
        tl.to(camera.position, {
          duration: config.duration,
          x: pt.x,
          y: pt.y,
          z: pt.z,
          ease: config.ease,
          onUpdate: () => {
            camera.lookAt(target);
          }
        });
      }
    });

    animationOnComplte.then(value => {
      __toggleCallback?.apply(null)
        if(enableMouseMove)
          __mouseMoveCallback?.apply(null, [])
    });
  }


}
