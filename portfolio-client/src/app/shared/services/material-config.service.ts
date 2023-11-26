type CanvasMaterialConfig = {
  materialName: string; parentObject: string; canvas: HTMLCanvasElement;
};

type MeshBasicMaterialConfig = {
  emissive: string; emissiveIntensity: number; metalness: number; roughness: number;
};

export class MaterialConfigService {
  constructor() {
  }

  public createMaterialsFromConfig(config: any, drawOnInit?: boolean): CanvasMaterialConfig[] {
    return config.materials.filter((material: any) => {
      return material.materialType === "canvas"
    }).map((material: any) => {
      return this.makeLabelCanvas(material, drawOnInit);
    });
  }

  public applyMaterialOptionsConfiguration(object: any, materialConfig: any, isLightMode: boolean): void {

    materialConfig.materials.filter((material: any) => {
      return material.materialType === "MeshBasicMaterial"
    }).map((material: any) => {
      material.configurations.forEach((config: any) => {
        config.objectElementsRegex.forEach((regexStr: string) => {
          const objectRegex = new RegExp(`^${regexStr}$`, 'gm');
          if (objectRegex.test(object.name)) {
            for (const [key, value] of Object.entries(config.options)) {
              if(!isLightMode){
                object.material.emissive.setHex(0x000000)
                object.material.emissiveIntensity = 1
                object.material.metalness = 1
                object.material.roughness = 1
              }else {
                if (key === "emissive") {
                  const hexColor = parseInt(value!.toString(), 16);
                  object.material.emissive.setHex(hexColor);
                } else {
                  object.material[key] = value;
                }
              }
            }
          }
        })
      });
    });


  }

  public evalValue(value: string | number, context: any): number {
    if (typeof value === 'string') {
      return Function('"use strict";return (' + value.replace(/parentWidth|parentHeight|index/g, (match) => context[match]) + ')')();
    }
    return value;
  }

  private makeLabelCanvas(materialConfig: any, drawOnInit?: boolean): CanvasMaterialConfig {
    const menuCanvas = document.createElement('canvas');
    menuCanvas.width = materialConfig.canvas.width;
    menuCanvas.height = materialConfig.canvas.height;

    const ctx: any = menuCanvas.getContext('2d');
    const parentWidth = materialConfig.canvas.width;
    const parentHeight = materialConfig.canvas.height;
    materialConfig.items.forEach((item: any) => {
      if (drawOnInit === undefined || !Object.hasOwn(item, 'drawOnInit') || item.drawOnInit === drawOnInit) {
        if (item.count) {
          for (let index = 0; index < item.count; index++) {
            this.drawItem(ctx, item, parentWidth, parentHeight, index);
          }
        } else {
          this.drawItem(ctx, item, parentWidth, parentHeight);
        }
      }
    });

    return {materialName: materialConfig.materialName, parentObject: materialConfig.parentObject, canvas: ctx.canvas};
  }

  private drawItem(ctx: CanvasRenderingContext2D, item: any, parentWidth: number, parentHeight: number, index?: number) {
    let x = this.evalValue(item.position.x, {parentWidth, index});
    let y = this.evalValue(item.position.y, {parentHeight, index});
    let width = this.evalValue(item.dimensions.width, {parentWidth});
    let height = this.evalValue(item.dimensions.height, {parentHeight});

    ctx.fillStyle = item.color;

    if (item.type && item.type?.value === "linear-gradient") {
      const startX = item.gradient.startX ? this.evalValue(item.gradient.startX, {parentWidth}) : 0;
      const startY = item.gradient.startY ? this.evalValue(item.gradient.startY, {parentHeight}) : 0;
      const endX = item.gradient.endX ? this.evalValue(item.gradient.endX, {parentWidth}) : this.evalValue("parentWidth / 2", {parentWidth});
      const endY = item.gradient.endY ? this.evalValue(item.gradient.endY, {parentHeight}) : this.evalValue("parentHeight / 2", {parentHeight});
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      item.gradient.colors.map((color: any, index: number) => {
        gradient.addColorStop(index / item.gradient.colors.length, color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, height);
    }

    if (item.type && item.type?.value === "image") {
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      let img = new Image();
      img.src = item.type.location === "external" ? `data:image/${item.type.format}+xml;utf8,${item.type.src}` : item.type.src;
      img.onload = function () {
        console.info("Image loaded successfully");
        ctx.drawImage(img, x, y, width, height);
      }
      img.onerror = function (err) {
        console.error("Error loading the image:", err);
      };
    }
    const metaData  = item.type?.hasOwnProperty('iconMetaData') ? item.type.iconMetaData : item.type?.hasOwnProperty('textMetaData') ? item.type.textMetaData : undefined;

    if(metaData && metaData.hasOwnProperty('placeholders')){
      this.handleMultiPropertyLabels(ctx, metaData, x, y, width, height)
    }
    else if (metaData) {
      ctx.fillStyle = `${metaData.color}`
      //const spacing = 12;
      ctx.font = `bold ${metaData.spacing}px sans-serif`;
      ctx.fillText(metaData.label, x, y + height + metaData.spacing);
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
    }


    // Draw title bar if present
    if (item.titleBarHeight) {
      let titleBarHeight = this.evalValue(item.titleBarHeight, {});
      ctx.fillStyle = item.titleBarColor;
      ctx.fillRect(x, y, width, titleBarHeight);
    }

    if (item.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0)";

    } else {
      ctx.fillRect(x, y, width, height);
    }
  }

  private handleMultiPropertyLabels(ctx : CanvasRenderingContext2D, metaData : any, x?: number, y?: number, width?: number, height?: number){

    const metaDataPlaceholders : any[] = [];
    for(let index = 0; index < Object.keys(metaData.placeholders).length; index++){
      metaDataPlaceholders.push(Object.values(Object.values(metaData.placeholders)[index] as {})[0])
    }

    const regex =/\$\d+/g;

    const words = metaData.label.split(regex)
    let sentenceWidth = 0;

    if(Array.isArray(words)){
      words.pop() // we remove the last element (in most cases its an empty space)
      words.map((value: string, index : number) => {
        ctx.fillStyle = `${metaData.color}`
        const spacing = metaData.spacing;
        ctx.font = `bold ${metaData.spacing}px sans-serif`;
        ctx.fillText(value, x! + sentenceWidth, y! + height! + metaData.spacing);
        sentenceWidth += ctx.measureText(value).width;
        ctx.fillStyle = `${(Object.values(Object.values(metaData.placeholders)[index] as Array<string>))[1]}`
        ctx.fillText(metaDataPlaceholders[index], x! + sentenceWidth, y! + height! + metaData.spacing);
        sentenceWidth += ctx.measureText(metaDataPlaceholders[index]).width;
      })
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0)";
  }
}
