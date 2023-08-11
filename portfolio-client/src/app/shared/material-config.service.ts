type CanvasConfig = {
  materialName: string;
  canvas: HTMLCanvasElement;
};

export class MaterialConfigService {
  constructor() {
  }

  public createMaterialsFromConfig(config: any): HTMLCanvasElement[] {
    return config.materials.map((material: any) => {
      return this.makeLabelCanvas(material).canvas;
    });
  }

  private makeLabelCanvas(materialConfig: any): CanvasConfig {
    const menuCanvas = document.createElement('canvas');
    menuCanvas.width = materialConfig.canvas.width;
    menuCanvas.height = materialConfig.canvas.height;

    const ctx: any = menuCanvas.getContext('2d');
    const parentWidth = materialConfig.canvas.width;
    const parentHeight = materialConfig.canvas.height;

    materialConfig.items.forEach((item: any) => {
      if (item.count) {
        for (let index = 0; index < item.count; index++) {
          this.drawItem(ctx, item, parentWidth, parentHeight, index);
        }
      } else {
        this.drawItem(ctx, item, parentWidth, parentHeight);
      }
    });

    return {materialName: materialConfig.materialName, canvas: ctx.canvas};
  }

  private drawItem(ctx: CanvasRenderingContext2D, item: any, parentWidth: number, parentHeight: number, index?: number) {
    let x = this.evalValue(item.position.x, {parentWidth, index});
    let y = this.evalValue(item.position.y, {parentHeight, index});
    let width = this.evalValue(item.dimensions.width, {parentWidth});
    let height = this.evalValue(item.dimensions.height, {parentHeight});

    ctx.fillStyle = item.color;
    if (item.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, width, height);
    }

    // Draw title bar if present
    if (item.titleBarHeight) {
      let titleBarHeight = this.evalValue(item.titleBarHeight, {});
      ctx.fillStyle = item.titleBarColor;
      ctx.fillRect(x, y, width, titleBarHeight);
    }

  }


  public evalValue(value: string | number, context: any): number {
    if (typeof value === 'string') {
      return Function('"use strict";return (' + value.replace(/parentWidth|parentHeight|index/g, (match) => context[match]) + ')')();
    }
    return value;
  }
}
