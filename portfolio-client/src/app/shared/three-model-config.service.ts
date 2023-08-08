export class ThreeModelConfigService {
  static applyProperties(target: any, source: any): void {

    Object.keys(source).forEach((key) => {
      const value = source[key];
      // Check if the target object has the key property before assigning
      if (target.hasOwnProperty(key)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if(value['readOnly']){
            target[key].set(...value['value'])
          }else{
            this.applyProperties(target[key], value);
          }
        } else{
          target[key] = value;
        }
      } else {
        console.warn(`Property "${key}" does not exist on target object and will be ignored.`);
      }
    });
  }
}
