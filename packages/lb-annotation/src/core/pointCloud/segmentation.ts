import DrawUtils from '@/utils/tool/DrawUtils';
import * as THREE from 'three';
import Sse3dLassoSelector from './selector/Sse3dLassoSelector';

interface IProps {
  dom: HTMLElement;
  render: any;
  getPointsInPolygon: any;
}

class PointCloudSegmentOperation {
  private pointer: THREE.Vector2 = new THREE.Vector2();

  private raycaster?: THREE.Raycaster;

  private dom: HTMLElement;

  private _highlight_Point: THREE.Points;

  private _temp: THREE.Points;

  private emitRender: any;

  private getPointsInPolygon: any;

  private _forbidRender = false;

  private mouseCanvas: HTMLCanvasElement | null;

  private polygon = [];

  private startX = NaN;

  private startY = NaN;

  // Operation Selector
  public selector;

  public forbidOperation: boolean = false;

  constructor(props: IProps) {
    this.dom = props.dom;

    this.selector = new Sse3dLassoSelector(this);

    const canvas = document.createElement('canvas');
    canvas.id = 'canvasMouse';
    // canvas.width = this.dom.clientWidth;
    // canvas.height = this.dom.clientHeight;
    this.updateCanvasBasicStyle(canvas, { width: this.dom.clientWidth, height: this.dom.clientHeight }, 10);

    this.dom.appendChild(canvas);
    this.dom.addEventListener('pointermove', this.onMouseMove);
    this.dom.addEventListener('pointerdown', this.onMouseDown);
    this.dom.addEventListener('pointerup', this.onMouseUp);
    canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };

    const ctx = canvas.getContext('2d');
    this.mouseCanvas = canvas;
    this.getPointsInPolygon = props.getPointsInPolygon;

    this.setupRaycaster();
    const geometry = new THREE.BufferGeometry();
    const pointsMaterial = new THREE.PointsMaterial({ size: 10, color: 'red' });
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));

    this._highlight_Point = new THREE.Points(geometry, pointsMaterial);
    this.emitRender = props.render;

    // tem
    const geometry2 = new THREE.BufferGeometry();
    const pointsMaterial2 = new THREE.PointsMaterial({ size: 5, color: 'white' });
    geometry2.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));

    this._temp = new THREE.Points(geometry2, pointsMaterial2);
  }

  public setForbidOperation(forbidOperation: boolean) {
    this.forbidOperation = forbidOperation;
  }

  public updateCanvasBasicStyle(canvas: HTMLCanvasElement, size: ISize, zIndex: number) {
    const pixel = 1;
    canvas.style.position = 'absolute';
    canvas.width = size.width * pixel;
    canvas.height = size.height * pixel;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = `${zIndex} `;
  }

  public addMorePoint(scene: THREE.Scene) {
    scene.add(this._highlight_Point);
    scene.add(this._temp);
  }

  public getCoordinate(e: MouseEvent) {
    const bounding = this.dom.getBoundingClientRect();
    return {
      x: e.clientX - bounding.left,
      y: e.clientY - bounding.top,
    };
  }

  public onMouseMove = (iev: MouseEvent) => {
    if (this.forbidOperation) {
      return;
    }

    const coord = this.getCoordinate(iev);
    this.pointer.x = (coord.x / this.dom.clientWidth) * 2 - 1;
    this.pointer.y = -(coord.y / this.dom.clientHeight) * 2 + 1;
    // console.log('this.point', this.pointer);
    // this.emitRender();
    const ev = {
      offsetX: iev.offsetX,
      offsetY: iev.offsetY,
      pageX: iev.pageX,
      pageY: iev.pageY,
      which: iev.buttons === 2 ? 3 : 0,
    };

    this.selector.mouseDrag(ev);
    // console.log('asd', iev);
  };

  public onMouseDown = (iev: MouseEvent) => {
    if (this.forbidOperation) {
      return;
    }

    this._forbidRender = true;
    const ev = {
      offsetX: iev.offsetX,
      offsetY: iev.offsetY,
      pageX: iev.pageX,
      pageY: iev.pageY,
      which: iev.buttons === 2 ? 3 : 0,
    };

    this.selector.mouseDown(ev);
  };

  public onMouseUp = (iev: MouseEvent) => {
    if (this.forbidOperation) {
      return;
    }

    const ev = {
      offsetX: iev.offsetX,
      offsetY: iev.offsetY,
      pageX: iev.pageX,
      pageY: iev.pageY,
      which: iev.button === 2 ? 3 : 0,
    };

    this.selector.mouseUp(ev);
  };

  public setupRaycaster() {
    const boundingBox = { x: 10, y: 10, z: 10 };
    const numberOfPoints = 10;

    this.raycaster = new THREE.Raycaster();
    const threshold = Math.cbrt((boundingBox.x * boundingBox.y * boundingBox.z) / numberOfPoints) / 3;
    if (this.raycaster) {
      // this.raycaster.params.Points.threshold = threshold;
      // this.raycaster.linePrecision = 0.1;
    }
  }

  public clearCanvasMouse() {
    this.mouseCanvas?.getContext('2d')?.clearRect(0, 0, this.dom.clientWidth, this.dom.clientHeight);
  }

  /**
   * Outside render.
   * @param param0
   */
  public render = ({ camera, scene }: { camera: THREE.Camera; scene: THREE.Scene }) => {
    this.clearCanvasMouse();

    // if (this._forbidRender) {
    //   return true;
    // }

    // // Update the pick of camera
    // this.raycaster.setFromCamera(this.pointer, camera);

    // const intersects = this.raycaster.intersectObjects(scene.children, false);

    // // console.log('intersects', intersects[0]);

    // const default_Point = new THREE.Vector3(0, 0, 0);

    // if (intersects.length > 0) {
    //   const intersect = intersects[0];
    //   // const points = intersects.reduce((acc, cur) => acc.concat([cur.point.x, cur.point.y, cur.point.z]), []);
    //   // const newPosition = new Float32Array(points);

    //   // this._highlight_Point.geometry.attributes.position.array = newPosition;
    //   // this._highlight_Point.geometry.attributes.position.needsUpdate = true;

    //   // console.log('intersects', newPosition);
    //   this._highlight_Point.position.copy(intersect.point);
    //   // .add(intersect.face.normal);
    // } else {
    //   this._highlight_Point.position.copy(default_Point);
    // }

    const originPolygon = this.selector.polygon;
    const polygon = [];
    if (originPolygon.length > 0 && this.mouseCanvas) {
      for (let i = 0; i < originPolygon.length; i += 1) {
        polygon.push({
          x: originPolygon[i][0],
          y: originPolygon[i][1],
        });
      }
      DrawUtils.drawPolygon(this.mouseCanvas, polygon, { isClose: false, color: 'red' });
    }
  };
}

export { PointCloudSegmentOperation };
