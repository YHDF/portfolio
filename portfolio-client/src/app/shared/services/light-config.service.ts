import { THREE } from '../../three-model/three-wrapper';
import {  ThreeModelConfigService} from "./three-model-config.service";

export class LightConfigService {
  static createLightsFromConfig(config: any): THREE.Light[] {
    const lights: THREE.Light[] = [];

    if (config.lights) {
      config.lights.forEach((lightConfig: any) => {
        const type = lightConfig.type;
        const color = new THREE.Color('#' + lightConfig.HexColorCode);
        const intensity = lightConfig.intensity;
        const distance = lightConfig.distance;
        let light: THREE.Light | any = undefined;

        if (type === 'PointLight') {
          light = new THREE.PointLight(color, intensity, distance);
        }
        // You can handle other types of lights here...

        if (light) {
          light.position.set(
            parseFloat(lightConfig.position.x),
            parseFloat(lightConfig.position.y),
            parseFloat(lightConfig.position.z)
          );

          if (lightConfig.castShadow) {
            light.castShadow = lightConfig.castShadow;
            ThreeModelConfigService.applyProperties(light.shadow, lightConfig.shadow);
          }

          lights.push(light);
        }
      });
    }

    return lights;
  }
}
