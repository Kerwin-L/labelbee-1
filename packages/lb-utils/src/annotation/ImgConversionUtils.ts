/**
 * @file Image Conversion Utils
 * @createDate 2022-08-08
 * @author Ron <ron.f.luo@gmail.com>
 */
import { colorArr } from "../constant/color";

/**
 * Notice！！
 * 
 * The number is from 0 to 255. Alpha is also in [0, 255]. It needs to distinguish it from rgba (a in rgba is [0 ,1])
 */
interface IColorRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ICustomColor {
  channel?: number; // Single Channel Value.
  color?: string; // You can use color to define it like 'red' | 'blue'
  rgba?: IColorRGBA; // Priority over color.
}

const BLACK_BACKGROUND_RGBA = { 
  r: 0,
  g: 0,
  b: 0,
  a: 255
}

const TRANSPARENCY_BACKGROUND_RGBA = {
  r: 0,
  g: 0,
  b: 0,
  a: 0
}


class ImgConversionUtils {
  public static createCanvas(imgNode: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = imgNode.width;
    canvas.height = imgNode.height;
    const ctx = canvas.getContext("2d")!;
    return { canvas, ctx };
  }

  public static createImgDom(src: string): Promise<HTMLImageElement> {
    const imgNode = new Image();
    imgNode.crossOrigin = "Anonymous";
    imgNode.src = src;

    return new Promise((resolve) => {
      imgNode.onload = () => {
        resolve(imgNode);
      };
      imgNode.onerror = (e) => {
        console.error(e);
      };
    });
  }

  public static nextTick = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      });
    });
  };
  
  public static getColorList = (customColor: ICustomColor) => {
    
  }

  /**
   * Extract single channel mask to render random colors
   * @param param0
   * @returns
   */
  public static renderColorByMask({
    renderCanvas,
    imgData,
    imgNode,
    customColor,
    hiddenUndefinedColor = false,
  }: {
    renderCanvas: HTMLCanvasElement;
    imgData: ImageData;
    imgNode: HTMLImageElement;
    customColor?: ICustomColor[];
    hiddenUndefinedColor?: boolean;
  }) {
    const ctx = renderCanvas.getContext("2d");

    if (ctx) {
      // // 1. The default background color is black.
      // ctx.fillStyle = backgroundColor;
      // ctx.fillRect(0, 0, imgNode.width, imgNode.height);

      /**
       * 2. Traversing image pixels
       *
       * If no color is set then the default color is drawn (From 'constant/color', But is can be hidden by hiddenUndefinedColor)
       */
      const getColor = ({ r }: IColorRGBA) => {
        // Temporarily Use rgb
        const colorByCustom = customColor?.find((i) => i?.channel === r)?.rgb; // use r to
        if (hiddenUndefinedColor === true && !colorByCustom) {
          return "";
        }
        return colorByCustom || colorArr[r].hexString;
      };

      ImgConversionUtils.renderPixelByImgData({
        ctx,
        imgData,
        getColor,
        originBackgroundRGBA:  BLACK_BACKGROUND_RGBA,
        backgroundRGBA: TRANSPARENCY_BACKGROUND_RGBA
      });

      // 3. Export Img
      const newImgSrc = renderCanvas.toDataURL("image/png");
      return newImgSrc;
    }
  }

  /**
   * Render Single Channel Mask by Color Img.
   * @param param0
   * @returns
   */
  public static renderMaskByColor({
    renderCanvas,
    imgData,
    imgNode,
    customColor,
    backgroundRGBA = {
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    }
  }: {
    renderCanvas: HTMLCanvasElement;
    imgData: ImageData;
    imgNode: HTMLImageElement;
    customColor?: ICustomColor[];
    backgroundRGBA?: IColorRGBA
  }) {
    const ctx = renderCanvas.getContext("2d");
    if (ctx) {
      // // 1. The default background color is black.
      // ctx.fillStyle = backgroundColor;
      // ctx.fillRect(0, 0, imgNode.width, imgNode.height);

      /**
       * 2. Traversing image pixels
       *
       * If no color is set then the default color is drawn (From 'constant/color'
       */
      const getColor = ({ r, g, b }: IColorRGBA) => {
        let color = undefined;

        customColor?.some((v) => {
          if (v.rgb) {
            const scope = 2;

            // If pixel edge is the same with the customColor with the scope of 2.
            if (
              r >= v.rgb.r - scope &&
              r <= v.rgb.r + scope &&
              g >= v.rgb.g - scope &&
              g <= v.rgb.g + scope &&
              b >= v.rgb.b - scope &&
              b <= v.rgb.b + scope
            ) {
              // color = `rgb(${v.channel},${v.channel},${v.channel})`;
              color = {
                r: v.channel,
                g: v.channel,
                b: v.channel,
                a: 255,
              }
              return true;
            }
            return false;
          }
        });
        return color;
      };
      ImgConversionUtils.renderPixelByImgData({
        ctx,
        imgData,
        getColor,
        originBackgroundRGBA: TRANSPARENCY_BACKGROUND_RGBA,
        backgroundRGBA: BLACK_BACKGROUND_RGBA
      });

      // 3. Export Img
      const newImgSrc = renderCanvas.toDataURL("image/png");
      return newImgSrc;
    }
  }

  /**
   * Traversing image pixels
   *
   * If no color is set then the default color is drawn (From 'constant/color', But is can be hidden by hiddenUndefinedColor)
   * @param ctx
   * @param imgData
   * @param size
   * @param getColor
   */
  public static renderPixelByImgData({
    ctx,
    imgData,
    getColor,

    originBackgroundRGBA,
    backgroundRGBA
  }: {
    ctx: CanvasRenderingContext2D;
    imgData: ImageData;
    getColor: ({ r, g, b, a }: IColorRGBA) => IColorRGBA;
    
    originBackgroundRGBA: IColorRGBA
    backgroundRGBA: IColorRGBA
  }) {
    
    console.time('renderPixelByImgData');
    for (let i = 0; i < imgData.data.length / 4; i++) {
      const index = i * 4;
      const r = imgData.data[index];
      const g = imgData.data[index + 1];
      const b = imgData.data[index + 2];
      const a = imgData.data[index + 3];

      // If it is originBackgroundRGBA. It needs to update to backgroundRGBA
      if (originBackgroundRGBA.r === r &&  originBackgroundRGBA.g === g && originBackgroundRGBA.b === b && originBackgroundRGBA.a === a) {
        imgData.data[index] =  backgroundRGBA.r;
        imgData.data[index + 1] = backgroundRGBA.g;
        imgData.data[index + 2] = backgroundRGBA.b;
        imgData.data[index + 3] = backgroundRGBA.a;
        continue;
      }

      
      const color = getColor({ r, g, b, a });
      
      if (!color) {
        // if (backgroundRGBA) {
        //   imgData.data[index] =  backgroundRGBA.r;
        //   imgData.data[index + 1] = backgroundRGBA.g;
        //   imgData.data[index + 2] = backgroundRGBA.b;
        //   imgData.data[index + 3] = backgroundRGBA.a;
        // } else {
          
          imgData.data[index + 3] = 0;
        // }
        continue;
      }
      imgData.data[index] = color.r;
      imgData.data[index + 1] = color.g;
      imgData.data[index + 2] = color.b;

      
      // ctx.fillStyle = color;
      // const x = Math.floor(i % size.width);
      // const y = Math.floor(i / size.width);
      // ctx.fillRect(x, y, 1, 1);
    }
    ctx.putImageData(imgData, 0, 0);
    console.timeEnd('renderPixelByImgData');
  }

  /**
   * Obtaining a color map from a single channel image
   * @param params
   * @returns
   */
  public static getColorMapBySingleChannelMask = async (params: {
    maskSrc: string;
    basicImgSrc?: string;
    customColor?: ICustomColor[];
    opacity?: number;
    // backgroundColor?: string;
    backgroundRGBA: IColorRGBA;
    
    hiddenUndefinedColor?: boolean;
  }) => {
    const {
      maskSrc,
      customColor,
      basicImgSrc,
      opacity = 0.3,
      hiddenUndefinedColor = false,
    } = params;
    try {
      const imgNode = await this.createImgDom(maskSrc);
      const { ctx: basicCtx } = this.createCanvas(imgNode);
      basicCtx.drawImage(imgNode, 0, 0, imgNode.width, imgNode.height);

      const { canvas: renderCanvas, ctx: renderCtx } =
        this.createCanvas(imgNode);

      /**
       * Rendering the underlying image by the way
       */
      if (basicImgSrc) {
        const basicImg = await this.createImgDom(basicImgSrc);
        renderCtx.drawImage(basicImg, 0, 0);

        // It needs to set transparency.
        renderCtx.globalAlpha = opacity;
      }

      /**
       * imgData requires delayed fetching.
       */
      await this.nextTick();
      const imgData = basicCtx.getImageData(
        0,
        0,
        imgNode.width,
        imgNode.height
      );
      const newImgSrc = this.renderColorByMask({
        renderCanvas,
        imgData,
        imgNode,
        customColor,
        // backgroundRGBA,
        hiddenUndefinedColor,
      });
      return newImgSrc;
    } catch (e) {
      console.error("Failed to load image");
    }
  };

  /**
   * Transfer ColorMask to Gray-scale Mask.
   *
   * 1. Clear the border sub pixel.
   * 2.
   * @param colorMaskBase64
   * @param colorMapping
   */
  public static getMaskByColorImg = async ({
    maskSrc,
    customColor,
  }: {
    maskSrc: string;
    customColor: ICustomColor[];
  }) => {
    try {
      const imgNode = await ImgConversionUtils.createImgDom(maskSrc);
      const { ctx: basicCtx } = this.createCanvas(imgNode);
      basicCtx.drawImage(imgNode, 0, 0, imgNode.width, imgNode.height);

      const { canvas: renderCanvas } = this.createCanvas(imgNode);

      /**
       * imgData requires delayed fetching.
       */
      await this.nextTick();
      const imgData = basicCtx.getImageData(
        0,
        0,
        imgNode.width,
        imgNode.height
      );
      const newImgSrc = this.renderMaskByColor({
        renderCanvas,
        imgData,
        imgNode,
        customColor,
      });
      return newImgSrc;
    } catch (e) {
      console.error("Failed to load image");
    }
  };
}

export default ImgConversionUtils;
