/**
 * @file For multi-level management of tools
 * @createDate 2022-07-27
 * @author Ron <ron.f.luo@gmail.com>
 */

import { RectOperation } from './toolOperation/rectOperation';
import PolygonOperation from './toolOperation/polygonOperation';
import { getConfig, styleDefaultConfig } from '@/constant/defaultConfig';
import { EToolName } from '@/constant/tool';
import { CommonToolUtils } from '..';
import { BasicToolOperation } from './toolOperation/basicToolOperation';

interface IToolSchedulerOperation {}

interface IToolSchedulerProps {
  container: HTMLElement;
  size: ISize;
  toolName: EToolName;
  imgNode?: HTMLImageElement; // 展示图片的内容
  config?: string; // 任务配置
  style?: any;
}

const createEmptyImage = (size: { width: number; height: number }) => {
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, size.width, size.height);
    return canvas.toDataURL();
  }
  return '';
};

export class ToolScheduler implements IToolSchedulerOperation {
  private container: HTMLElement;

  private toolOperationList: Array<RectOperation | PolygonOperation>;

  private toolOperationDom: Array<HTMLElement>;

  private size: ISize;

  private config: string; // 定义 TODO！！

  private style: any; // 定义 TODO！！

  private imgNode?: HTMLImageElement;

  constructor(props: IToolSchedulerProps) {
    this.toolOperationList = [];
    this.toolOperationDom = [];

    this.container = props.container;
    this.size = props.size;
    this.imgNode = props.imgNode;
    this.config = props.config ?? JSON.stringify(getConfig(props.toolName)); // 设置默认操作
    this.style = props.style ?? styleDefaultConfig; // 设置默认操作
  }

  public setImgNode(imgNode: HTMLImageElement) {
    this.createOperation(undefined, imgNode);
  }

  public createBasicImg() {}

  public createOperation(tool?: EToolName, imgNode?: HTMLImageElement) {
    const dom = window.document.createElement('div');
    dom.style.position = 'absolute';
    dom.style.left = '0';
    dom.style.top = '0';
    dom.style.width = `${this.size.width}px`;
    dom.style.height = `${this.size.height}px`;
    dom.style.zIndex = `${this.toolOperationList.length + 1}`;

    const imgSrc = createEmptyImage(this.size);

    const emptyImgNode = new Image();
    emptyImgNode.src = imgSrc;
    emptyImgNode.width = this.size.width;
    emptyImgNode.height = this.size.height;

    const defaultData = {
      container: dom,
      size: this.size,
      config: this.config,
      drawOutSideTarget: false,
      style: this.style,
      imgNode: imgNode || emptyImgNode,
      // isAppend: false,
    };

    let toolInstance;
    if (!tool) {
      // basic
      toolInstance = new BasicToolOperation(defaultData);
      dom.style.zIndex = '0';
    } else {
      const ToolOperation: any = CommonToolUtils.getCurrentOperation(tool);
      if (!ToolOperation) {
        return;
      }

      toolInstance = new ToolOperation(defaultData);
    }
    toolInstance.init();
    toolInstance.canvas.id = tool ?? 'basicCanvas';
    if (!tool) {
      this.container.insertBefore(dom, this.container.childNodes[0]);
      return;
    }
    this.container.appendChild(dom);

    this.toolOperationList.push(toolInstance);
    this.toolOperationDom.push(dom);

    return toolInstance;
  }

  public switchCanvas() {
    this.toolOperationDom[0].style.zIndex = `2`;
    this.toolOperationDom[1].style.zIndex = `1`;
  }
}
