import Sse3dSelector from './Sse3dSelector';

export default class extends Sse3dSelector {
  mouseDown(ev) {
    if (ev.which === 3) {
      this.pushPoint(ev.offsetX, ev.offsetY);
    }
  }

  mouseUp(ev) {
    if (ev.which === 3) {
      // this.scene.selectByPolygon(this.polygon);
      this.scene.getPointsInPolygon(this.polygon);
      this.polygon = [];
      this.scene.emitRender(true);
    }
  }

  mouseDrag(ev) {
    if (ev.which === 3) {
      this.pushPoint(ev.offsetX, ev.offsetY);
      this.scene.emitRender(true);
    }
  }
}
