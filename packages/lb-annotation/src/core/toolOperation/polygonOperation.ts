import MathUtils from '@/utils/MathUtils';
import { DEFAULT_TEXT_OFFSET, EDragStatus, EDragTarget, ESortDirection } from '../../constant/annotation';
import EKeyCode from '../../constant/keyCode';
import { edgeAdsorptionScope, EToolName } from '../../constant/tool';
import locale from '../../locales';
import { EMessage } from '../../locales/constants';
import { IPolygonConfig, IPolygonData, IPolygonPoint } from '../../types/tool/polygon';
import ActionsHistory from '../../utils/ActionsHistory';
import AttributeUtils from '../../utils/tool/AttributeUtils';
import AxisUtils from '../../utils/tool/AxisUtils';
import CanvasUtils from '../../utils/tool/CanvasUtils';
import CommonToolUtils from '../../utils/tool/CommonToolUtils';
import DrawUtils from '../../utils/tool/DrawUtils';
import PolygonUtils from '../../utils/tool/PolygonUtils';
import StyleUtils from '../../utils/tool/StyleUtils';
import uuid from '../../utils/uuid';
import { BasicToolOperation, IBasicToolOperationProps } from './basicToolOperation';
import TextAttributeClass from './textAttributeClass';
import RectUtils from '@/utils/tool/RectUtils';

const TEXT_MAX_WIDTH = 164;

// 文本展示的偏移
const TEXT_ATTRIBUTE_OFFSET = {
  x: 8,
  y: 26,
};

interface IPolygonOperationProps extends IBasicToolOperationProps {}

class PolygonOperation extends BasicToolOperation {
  public config: IPolygonConfig;

  // RENDER
  public drawingPointList: IPolygonPoint[]; // 正在绘制的多边形，在 zoom 底下

  public polygonList: IPolygonData[];

  public hoverID?: string;

  public hoverPointIndex: number;

  public hoverEdgeIndex: number;

  public selectedID?: string;

  public editPolygonID?: string; // 是否进入编辑模式

  private dragInfo?: {
    dragStartCoord: ICoordinate;
    initPointList: IPolygonPoint[];
    changePointIndex?: number[]; // 用于存储拖拽点 / 边的下标
    dragTarget: EDragTarget;
  };

  private drawingHistory: ActionsHistory; // 用于正在编辑中的历史记录

  private isCtrl: boolean; // 当前的是否按住了 ctrl

  private isAlt: boolean; // 当前是否按住了 alt

  private _textAttributInstance?: TextAttributeClass;

  constructor(props: IPolygonOperationProps) {
    super(props);
    this.config = CommonToolUtils.jsonParser(props.config);
    this.drawingPointList = [];
    this.polygonList = [];
    this.hoverPointIndex = -1;
    this.hoverEdgeIndex = -1;

    this.drawingHistory = new ActionsHistory();
    this.isCtrl = false;
    this.isAlt = false;

    this.getCurrentSelectedData = this.getCurrentSelectedData.bind(this);
    this.updateSelectedTextAttribute = this.updateSelectedTextAttribute.bind(this);
  }

  public eventBinding() {
    super.eventBinding();
    // 解绑原本的 onMouseUp，将 onMoueUp 用于 dblClickListener ß进行绑定
    this.container.removeEventListener('mouseup', this.onMouseUp);

    this.container.addEventListener('mouseup', this.dragMouseUp);
    this.dblClickListener.addEvent(this.onMouseUp, this.onLeftDblClick, this.onRightDblClick, this.isAllowDouble);
  }

  public eventUnbinding() {
    super.eventUnbinding();
    this.container.removeEventListener('mouseup', this.dragMouseUp);
  }

  public destroy() {
    super.destroy();
    if (this._textAttributInstance) {
      this._textAttributInstance.clearTextAttribute();
    }
  }

  public get selectedPolygon() {
    return PolygonUtils.getPolygonByID(this.polygonList, this.selectedID);
  }

  public get polygonListUnderZoom() {
    return this.polygonList.map((polygon) => ({
      ...polygon,
      pointList: AxisUtils.changePointListByZoom(polygon.pointList, this.zoom),
    }));
  }

  public get selectedText() {
    return this.selectedPolygon?.textAttribute;
  }

  // 是否直接执行操作
  public isAllowDouble = (e: MouseEvent) => {
    const { selectedID } = this;

    const currentSelectedID = this.getHoverID(e);
    // 仅在选中的时候需要 double click
    if (selectedID && selectedID === currentSelectedID) {
      return true;
    }

    return false;
  };

  get dataList() {
    return this.polygonList;
  }

  /**
   * 当前页面展示的框体
   */
  public get currentShowList() {
    let polygon: IPolygonData[] = [];
    const [showingPolygon, selectdPolygon] = CommonToolUtils.getRenderResultList<IPolygonData>(
      this.polygonList,
      CommonToolUtils.getSourceID(this.basicResult),
      this.attributeLockList,
      this.selectedID,
    );
    polygon = showingPolygon;

    if (this.isHidden) {
      polygon = [];
    }

    if (selectdPolygon) {
      polygon.push(selectdPolygon);
    }
    return polygon;
  }

  /**
   * 当前依赖状态下本页的所有框
   *
   * @readonly
   * @memberof RectOperation
   */
  public get currentPageResult() {
    const [showingPolygon] = CommonToolUtils.getRenderResultList<IPolygonData>(
      this.polygonList,
      CommonToolUtils.getSourceID(this.basicResult),
      [],
    );
    return showingPolygon;
  }

  public setResult(polygonList: IPolygonData[]) {
    this.clearActiveStatus();
    this.setPolygonList(polygonList);
    this.render();
  }

  /**
   * 外层 sidabr 调用
   * @param v
   * @returns
   */
  public textChange = (v: string) => {
    if (this.config.textConfigurable === false || !this.selectedID) {
      return;
    }
    this.setPolygonList(AttributeUtils.textChange(v, this.selectedID, this.polygonList));
    this.emit('selectedChange'); // 触发外层的更新
    this.render();
  };

  /**
   * 设定指定多边形的信息
   * @param id
   * @param newPolygonData
   * @returns
   */
  public setPolygonDataByID(newPolygonData: Partial<IPolygonData>, id?: string) {
    return this.polygonList.map((polygon) => {
      if (polygon.id === id) {
        return {
          ...polygon,
          ...newPolygonData,
        };
      }
      return polygon;
    });
  }

  public addPointInDrawing(e: MouseEvent) {
    if (!this.imgInfo) {
      return;
    }

    const { upperLimitPointNum, edgeAdsorption } = this.config;
    if (upperLimitPointNum && this.drawingPointList.length >= upperLimitPointNum) {
      // 小于对应的下限点, 大于上限点无法添加
      this.emit(
        'messageInfo',
        `${locale.getMessagesByLocale(EMessage.UpperLimitErrorNotice, this.lang)}${upperLimitPointNum}`,
      );

      return;
    }

    this.setSelectedID('');
    const coordinateZoom = this.getCoordinateUnderZoom(e);
    const coordinate = AxisUtils.changeDrawOutsideTarget(
      coordinateZoom,
      { x: 0, y: 0 },
      this.imgInfo,
      this.config.drawOutsideTarget,
      this.basicResult,
      this.zoom,
    );

    // 判断是否的初始点，是则进行闭合
    const calculateHoverPointIndex = AxisUtils.returnClosePointIndex(
      coordinate,
      AxisUtils.changePointListByZoom(this.drawingPointList, this.zoom),
    );
    if (calculateHoverPointIndex === 0) {
      this.addDrawingPointToPolygonList();
      return;
    }

    const { dropFoot } = PolygonUtils.getClosestPoint(
      coordinate,
      this.polygonListUnderZoom,
      this.config.lineType,
      edgeAdsorptionScope,
    );

    const coordinateWithOrigin = AxisUtils.changePointByZoom(
      dropFoot && e.altKey === false && edgeAdsorption ? dropFoot : coordinate,
      1 / this.zoom,
    );

    this.drawingPointList.push(coordinateWithOrigin);
    if (this.drawingPointList.length === 1) {
      this.drawingHistory.initRecord(this.drawingPointList);
    } else {
      this.drawingHistory.pushHistory(this.drawingPointList);
    }
  }

  // 全局操作
  public clearResult() {
    this.setPolygonList([]);
    this.setSelectedID(undefined);
    this.render();
  }

  /**
   *  清除多边形拖拽的中间状态
   */
  public clearPolygonDrag() {
    this.drawingPointList = [];
    this.dragInfo = undefined;
    this.dragInfo = undefined;
    this.dragStatus = EDragStatus.Wait;
    this.hoverEdgeIndex = -1;
    this.hoverPointIndex = -1;
    this.hoverID = '';
  }

  /**
   *  清楚所有的中间状态
   */
  public clearActiveStatus() {
    this.clearPolygonDrag();
    this.setSelectedID(undefined);
  }

  // SET DATA
  public setPolygonList(polygonList: IPolygonData[]) {
    const oldLen = this.polygonList.length;
    this.polygonList = polygonList;

    if (oldLen !== polygonList.length) {
      // 件数发生改变
      this.emit('updatePageNumber');
    }
  }

  public setSelectedID(newID?: string) {
    const oldID = this.selectedID;
    if (newID !== oldID && oldID) {
      // 触发文本切换的操作

      this._textAttributInstance?.changeSelected();
    }

    if (!newID) {
      this._textAttributInstance?.clearTextAttribute();
    }

    this.selectedID = newID;

    this.render();
    this.emit('selectedChange');
  }

  public setDefaultAttribute(defaultAttribute: string = '') {
    const oldDefault = this.defaultAttribute;
    this.defaultAttribute = defaultAttribute;

    if (oldDefault !== defaultAttribute) {
      // 如果更改 attribute 需要同步更改 style 的样式
      this.changeStyle(defaultAttribute);

      //  触发侧边栏同步
      this.emit('changeAttributeSidebar');

      // 如有选中目标，则需更改当前选中的属性
      const { selectedID } = this;
      if (selectedID) {
        if (this.selectedPolygon) {
          this.selectedPolygon.attribute = defaultAttribute;
        }
        this.history.pushHistory(this.polygonList);
        this.render();
      }

      if (this._textAttributInstance) {
        if (this.attributeLockList.length > 0 && !this.attributeLockList.includes(defaultAttribute)) {
          // 属性隐藏
          this._textAttributInstance.clearTextAttribute();
          return;
        }

        this._textAttributInstance.updateIcon(this.getTextIconSvg(defaultAttribute));
      }
    }
  }

  public setStyle(toolStyle: any) {
    super.setStyle(toolStyle);

    // 当存在文本 icon 的时候需要更改当前样式
    if (this._textAttributInstance && this.config.attributeConfigurable === false) {
      this._textAttributInstance?.updateIcon(this.getTextIconSvg());
    }
  }

  public setPolygonValidAndRender(id: string) {
    if (!id) {
      return;
    }

    const newPolygonList = this.polygonList.map((polygon) => {
      if (polygon.id === id) {
        return {
          ...polygon,
          valid: !polygon.valid,
        };
      }

      return polygon;
    });

    this.setPolygonList(newPolygonList);
    this.history.pushHistory(this.polygonList);
    this.render();

    // 同步外层
    this.emit('updateResult');
  }

  /**
   * 初始化的添加的数据
   * @returns
   */
  public addDrawingPointToPolygonList() {
    let { lowerLimitPointNum = 3 } = this.config;

    if (lowerLimitPointNum < 3) {
      lowerLimitPointNum = 3;
    }

    if (this.drawingPointList.length < lowerLimitPointNum) {
      // 小于下线点无法闭合, 直接清除数据
      this.drawingPointList = [];
      this.editPolygonID = '';

      return;
    }

    const basicSourceID = CommonToolUtils.getSourceID(this.basicResult);

    const polygonList = [...this.polygonList];
    if (this.editPolygonID) {
      const samePolygon = polygonList.find((polygon) => polygon.id === this.editPolygonID);
      if (!samePolygon) {
        return;
      }
      samePolygon.pointList = this.drawingPointList;
      this.editPolygonID = '';
    } else {
      const id = uuid(8, 62);
      let newPolygon: IPolygonData = {
        id,
        sourceID: basicSourceID,
        valid: !this.isCtrl,
        textAttribute: '',
        pointList: this.drawingPointList,
        attribute: this.defaultAttribute,
        order:
          CommonToolUtils.getMaxOrder(
            polygonList.filter((v) => CommonToolUtils.isSameSourceID(v.sourceID, basicSourceID)),
          ) + 1,
      };

      if (this.config.textConfigurable) {
        let textAttribute = '';
        textAttribute = AttributeUtils.getTextAttribute(
          this.polygonList.filter((polygon) => CommonToolUtils.isSameSourceID(polygon.sourceID, basicSourceID)),
          this.config.textCheckType,
        );
        newPolygon = {
          ...newPolygon,
          textAttribute,
        };
      }
      polygonList.push(newPolygon);

      this.setSelectedIdAfterAddingDrawing(id);
    }

    this.setPolygonList(polygonList);
    this.isCtrl = false;
    this.drawingPointList = [];

    this.history.pushHistory(polygonList);
  }

  public setSelectedIdAfterAddingDrawing(newID: string) {
    if (this.drawingPointList.length === 0) {
      return;
    }

    if (this.config.textConfigurable) {
      this.setSelectedID(newID);
    } else {
      this.setSelectedID();
    }
  }

  /**
   * 获取当前 hover 多边形的 ID
   * @param e
   * @returns
   */
  public getHoverID(e: MouseEvent) {
    const coordinate = this.getCoordinateUnderZoom(e);
    const polygonListWithZoom = this.currentShowList.map((polygon) => ({
      ...polygon,
      pointList: AxisUtils.changePointListByZoom(polygon.pointList, this.zoom),
    }));
    return PolygonUtils.getHoverPolygonID(coordinate, polygonListWithZoom, 10, this.config?.lineType);
  }

  public getHoverEdgeIndex(e: MouseEvent) {
    if (!this.selectedID) {
      return -1;
    }

    const selectPolygon = this.selectedPolygon;

    if (!selectPolygon) {
      return -1;
    }
    const currentCoord = this.getCoordinateUnderZoom(e);
    const editPointListUnderZoom = AxisUtils.changePointListByZoom(selectPolygon.pointList, this.zoom);
    return PolygonUtils.getHoverEdgeIndex(currentCoord, editPointListUnderZoom, this.config?.lineType);
  }

  public getHoverPointIndex(e: MouseEvent) {
    if (!this.selectedID) {
      return -1;
    }

    const selectPolygon = this.selectedPolygon;

    if (!selectPolygon) {
      return -1;
    }
    const currentCoord = this.getCoordinateUnderZoom(e);
    const editPointListUnderZoom = AxisUtils.changePointListByZoom(selectPolygon.pointList, this.zoom);
    return AxisUtils.returnClosePointIndex(currentCoord, editPointListUnderZoom);
  }

  public deletePolygon(id?: string) {
    if (!id) {
      return;
    }

    this.setPolygonList(this.polygonList.filter((polygon) => polygon.id !== id));
    this.history.pushHistory(this.polygonList);
    this._textAttributInstance?.clearTextAttribute();
    this.emit('selectedChange');
    this.render();
  }

  public deletePolygonPoint(index: number) {
    if (!this.selectedID) {
      return;
    }

    const { selectedPolygon } = this;

    if (!selectedPolygon) {
      return;
    }

    let { lowerLimitPointNum } = this.config;

    if (lowerLimitPointNum < 3) {
      lowerLimitPointNum = 3;
    }

    if (selectedPolygon.pointList.length <= lowerLimitPointNum) {
      this.emit(
        'messageInfo',
        `${locale.getMessagesByLocale(EMessage.LowerLimitErrorNotice, this.lang)}${lowerLimitPointNum}`,
      );
      return;
    }

    selectedPolygon?.pointList.splice(index, 1);
    this.history.pushHistory(this.polygonList);
    this.render();
  }

  // OPERATION

  public spaceKeydown() {
    // 续标检测
    if (this.selectedID) {
      this.editPolygonID = this.selectedID;
      this.drawingPointList = this.selectedPolygon?.pointList ?? [];
      this.drawingHistory.empty();
      this.drawingHistory.initRecord(this.drawingPointList);

      this.hoverID = '';
      this.setSelectedID('');
      this.render();
    }
  }

  public onTabKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    if (this.drawingPointList.length > 0) {
      // 如果正在编辑则不允许使用 Tab 切换
      return;
    }

    let sort = ESortDirection.ascend;
    if (e.shiftKey) {
      sort = ESortDirection.descend;
    }

    const [showingResult, selectedResult] = CommonToolUtils.getRenderResultList<IPolygonData>(
      this.polygonList,
      CommonToolUtils.getSourceID(this.basicResult),
      this.attributeLockList,
      this.selectedID,
    );

    let polygonList = [...showingResult];
    if (selectedResult) {
      polygonList = [...polygonList, selectedResult];
    }

    const viewPort = CanvasUtils.getViewPort(this.canvas, this.currentPos, this.zoom);

    const sortList = polygonList
      .map((v) => ({
        ...v,
        x: v.pointList[0]?.x ?? 0,
        y: v.pointList[0]?.y ?? 0,
      }))
      .filter((polygon) => CanvasUtils.inViewPort({ x: polygon.x, y: polygon.y }, viewPort));

    const nextSelectedResult = CommonToolUtils.getNextSelectedRectID(sortList, sort, this.selectedID);
    if (nextSelectedResult) {
      this.setSelectedID(nextSelectedResult.id);
      const { selectedPolygon } = this;
      if (selectedPolygon) {
        this.setDefaultAttribute(selectedPolygon.attribute);
      }
    }
    this.render();
  }

  public onKeyDown(e: KeyboardEvent) {
    if (!CommonToolUtils.hotkeyFilter(e)) {
      // 如果为输入框则进行过滤
      return;
    }

    if (super.onKeyDown(e) === false) {
      return;
    }

    const { keyCode } = e;
    switch (keyCode) {
      case EKeyCode.Space:
        this.spaceKeydown();
        break;

      case EKeyCode.Esc:
        this.drawingPointList = [];
        this.editPolygonID = '';

        break;

      case EKeyCode.F:
        if (this.selectedID) {
          this.setPolygonValidAndRender(this.selectedID);
        }

        break;

      case EKeyCode.Z:
        this.setIsHidden(!this.isHidden);
        this.render();
        break;

      case EKeyCode.Delete:
        this.deletePolygon(this.selectedID);
        this.render();
        break;

      case EKeyCode.Ctrl:
        this.isCtrl = true;
        break;

      case EKeyCode.Alt:
        if (this.isAlt === false) {
          e.preventDefault();
          this.isAlt = true;
          this.render();
        }

        break;

      case EKeyCode.Tab: {
        this.onTabKeyDown(e);
        break;
      }

      default: {
        if (this.config.attributeConfigurable) {
          const keyCode2Attribute = AttributeUtils.getAttributeByKeycode(keyCode, this.config.attributeList);

          if (keyCode2Attribute !== undefined) {
            this.setDefaultAttribute(keyCode2Attribute);
          }
        }
        break;
      }
    }
  }

  public onKeyUp(e: KeyboardEvent) {
    super.onKeyUp(e);

    switch (e.keyCode) {
      case EKeyCode.Ctrl:
        this.isCtrl = false;
        break;

      case EKeyCode.Alt: {
        const oldAlt = this.isAlt;
        this.isAlt = false;
        if (oldAlt === true) {
          this.render();
        }
        break;
      }

      default: {
        break;
      }
    }
  }

  public rightMouseUp() {
    // 标注中的数据结束
    if (this.drawingPointList.length > 0) {
      //
      this.addDrawingPointToPolygonList();
      return;
    }

    // 右键选中设置
    this.setSelectedID(this.hoverID);
    const { selectedPolygon } = this;
    if (selectedPolygon) {
      this.setDefaultAttribute(selectedPolygon.attribute);
    }
  }

  public onLeftDblClick(e: MouseEvent) {
    if (this.hoverEdgeIndex > -1) {
      const currentCoord = this.getCoordinateUnderZoom(e);
      const { selectedPolygon } = this;
      if (!selectedPolygon) {
        return;
      }

      const { dropFoot } = PolygonUtils.getClosestPoint(
        currentCoord,
        this.polygonListUnderZoom,
        this.config.lineType,
        edgeAdsorptionScope,
      );

      if (!dropFoot) {
        return;
      }

      const { upperLimitPointNum } = this.config;
      if (upperLimitPointNum && selectedPolygon.pointList.length >= upperLimitPointNum) {
        // 小于对应的下限点, 大于上限点无法添加
        this.emit(
          'messageInfo',
          `${locale.getMessagesByLocale(EMessage.UpperLimitErrorNotice, this.lang)}${upperLimitPointNum}`,
        );
        this.clearPolygonDrag();
        return;
      }

      selectedPolygon?.pointList.splice(
        this.hoverEdgeIndex + 1,
        0,
        AxisUtils.changePointByZoom(dropFoot, 1 / this.zoom),
      );
      this.setPolygonDataByID(selectedPolygon, this.selectedID);
      this.history.pushHistory(this.polygonList);
      this.hoverPointIndex = -1;
      this.hoverEdgeIndex = -1;
      this.render();
    }
    this.dragInfo = undefined;
  }

  public onRightDblClick(e: MouseEvent) {
    this.dragInfo = undefined;
    this.clearImgDrag();

    const hoverID = this.getHoverID(e);
    const hoverPointIndex = this.getHoverPointIndex(e);
    if (this.hoverPointIndex > -1 && this.hoverPointIndex === hoverPointIndex) {
      this.deletePolygonPoint(hoverPointIndex);
      this.dragInfo = undefined;
      this.hoverPointIndex = -1;
      this.render();
      return;
    }

    if (this.hoverID === this.selectedID) {
      this.deletePolygon(hoverID);
    }

    this.render();
  }

  public onMouseDown(e: MouseEvent) {
    if (super.onMouseDown(e) || this.forbidMouseOperation || e.ctrlKey === true) {
      return;
    }

    const firstPolygon = this.selectedPolygon;

    if (!firstPolygon || e.button !== 0) {
      return;
    }
    const hoverID = this.getHoverID(e);

    if (hoverID !== this.selectedID) {
      // 无选中则无法进行拖拽，提前退出
      return;
    }

    const initPointList = firstPolygon.pointList;
    const dragStartCoord = this.getCoordinateUnderZoom(e);
    let changePointIndex = [0];

    let dragTarget = EDragTarget.Plane;
    this.dragStatus = EDragStatus.Start;

    const closePointIndex = this.getHoverPointIndex(e);
    const closeEdgeIndex = this.getHoverEdgeIndex(e);

    if (closePointIndex > -1) {
      dragTarget = EDragTarget.Point;
      changePointIndex = [closePointIndex];
    } else if (closeEdgeIndex > -1 && this.hoverEdgeIndex > -1) {
      dragTarget = EDragTarget.Line;
      changePointIndex = [closeEdgeIndex, (closeEdgeIndex + 1) % initPointList.length];
    }

    this.dragInfo = {
      dragStartCoord,
      dragTarget,
      initPointList,
      changePointIndex,
    };

    return true;
  }

  public onDragMove(e: MouseEvent) {
    if (!this.dragInfo || !this.selectedID) {
      return;
    }

    let selectedPointList: IPolygonPoint[] | undefined = this.selectedPolygon?.pointList;
    if (!selectedPointList) {
      return;
    }

    const { initPointList, dragStartCoord, dragTarget, changePointIndex } = this.dragInfo;
    const coordinate = this.getCoordinateUnderZoom(e);

    const offset = {
      x: (coordinate.x - dragStartCoord.x) / this.zoom,
      y: (coordinate.y - dragStartCoord.y) / this.zoom,
    };

    this.dragStatus = EDragStatus.Move;

    switch (dragTarget) {
      case EDragTarget.Plane:
        selectedPointList = selectedPointList.map((v, i) => ({
          ...v,
          x: initPointList[i].x + offset.x,
          y: initPointList[i].y + offset.y,
        }));

        break;

      case EDragTarget.Point:
      case EDragTarget.Line:
        selectedPointList = selectedPointList.map((n, i) => {
          if (changePointIndex && changePointIndex.includes(i)) {
            return {
              ...n,
              x: initPointList[i].x + offset.x,
              y: initPointList[i].y + offset.y,
            };
          }
          return n;
        });
        break;

      default: {
        break;
      }
    }

    // 边缘判断 - 仅限支持图片下范围下
    if (this.config.drawOutsideTarget === false && this.imgInfo) {
      if (this.dependToolName && this.basicCanvas && this.basicResult) {
        let isOutSide = false;
        switch (this.dependToolName) {
          case EToolName.Rect: {
            // 依赖拉框
            isOutSide = selectedPointList.filter((v) => !RectUtils.isInRect(v, this.basicResult)).length > 0;

            break;
          }
          case EToolName.Polygon: {
            isOutSide = PolygonUtils.isPointListOutSidePolygon(
              selectedPointList,
              this.basicResult.pointList,
              this.config.lineType,
            );
            break;
          }
          default: {
            //
          }
        }

        if (isOutSide) {
          // 在边界外直接跳出
          return;
        }
      }

      const { left, top, right, bottom } = MathUtils.calcViewportBoundaries(
        AxisUtils.changePointListByZoom(selectedPointList, this.zoom),
      );

      const scope = 0.00001;
      if (left < 0 || top < 0 || right > this.imgInfo.width + scope || bottom > this.imgInfo.height + scope) {
        // 超出范围则不进行编辑
        return;
      }
    }

    const newPolygonList = this.polygonList.map((v) => {
      if (v.id === this.selectedID) {
        return {
          ...v,
          pointList: selectedPointList as IPolygonPoint[],
        };
      }

      return v;
    });

    this.setPolygonList(newPolygonList);
    this.render();
  }

  public onMouseMove(e: MouseEvent) {
    if (super.onMouseMove(e) || this.forbidMouseOperation || !this.imgInfo) {
      return;
    }

    if (this.selectedID && this.dragInfo) {
      this.onDragMove(e);
      return;
    }

    let hoverPointIndex = -1;
    let hoverEdgeIndex = -1;

    const { selectedID } = this;
    if (selectedID) {
      this.hoverEdgeIndex = -1;
      this.hoverPointIndex = -1;

      hoverPointIndex = this.getHoverPointIndex(e);

      // 注意： 点的优先级大于边
      if (hoverPointIndex > -1) {
        this.hoverPointIndex = hoverPointIndex;
      } else {
        hoverEdgeIndex = this.getHoverEdgeIndex(e);
        this.hoverEdgeIndex = hoverEdgeIndex;
      }
    }

    if (this.drawingPointList.length > 0) {
      // 编辑中无需 hover操作

      return;
    }

    const newHoverID = this.getHoverID(e);
    if (this.hoverID !== newHoverID) {
      this.hoverID = newHoverID;
      this.render();
    }
  }

  public leftMouseUp(e: MouseEvent) {
    const hoverID = this.getHoverID(e);
    if (this.drawingPointList.length === 0 && e.ctrlKey === true && hoverID) {
      // ctrl + 左键 + hover存在，更改框属性
      this.setPolygonValidAndRender(hoverID);
      return;
    }

    // 创建多边形
    this.addPointInDrawing(e);
  }

  public onMouseUp(e: MouseEvent) {
    if (super.onMouseUp(e) || this.forbidMouseOperation || !this.imgInfo) {
      return undefined;
    }

    if (this.dragInfo && this.dragStatus === EDragStatus.Move) {
      // 拖拽停止
      this.dragInfo = undefined;
      this.dragStatus = EDragStatus.Wait;
      this.history.pushHistory(this.polygonList);

      // 同步 结果
      this.emit('updateResult');
      return;
    }

    switch (e.button) {
      case 0: {
        this.leftMouseUp(e);
        break;
      }

      case 2: {
        this.rightMouseUp();

        break;
      }

      default: {
        break;
      }
    }
    this.render();
  }

  public dragMouseUp() {
    if (this.dragStatus === EDragStatus.Start) {
      this.dragInfo = undefined;
      this.dragStatus = EDragStatus.Wait;
    }
  }

  public exportData() {
    const { polygonList } = this;

    return [polygonList, this.basicImgInfo];
  }

  /**
   * 获取当前配置下的 icon svg
   * @param attribute
   */
  public getTextIconSvg(attribute = '') {
    return AttributeUtils.getTextIconSvg(
      attribute,
      this.config.attributeList,
      this.config.attributeConfigurable,
      this.baseIcon,
    );
  }

  public getCurrentSelectedData() {
    const { selectedPolygon } = this;
    if (!selectedPolygon) {
      return;
    }

    const toolColor = this.getColor(selectedPolygon.attribute);
    const color = selectedPolygon.valid ? toolColor?.valid.stroke : toolColor?.invalid.stroke;
    return {
      width: TEXT_MAX_WIDTH,
      textAttribute: selectedPolygon.textAttribute,
      color,
    };
  }

  /** 更新文本输入，并且进行关闭 */
  public updateSelectedTextAttribute(newTextAttribute?: string) {
    if (this._textAttributInstance && newTextAttribute && this.selectedID) {
      // 切换的时候如果存在

      let textAttribute = newTextAttribute;
      if (AttributeUtils.textAttributeValidate(this.config.textCheckType, '', textAttribute) === false) {
        this.emit('messageError', AttributeUtils.getErrorNotice(this.config.textCheckType, this.lang));
        textAttribute = '';
      }

      this.setPolygonList(AttributeUtils.textChange(textAttribute, this.selectedID, this.polygonList));
      this.emit('updateTextAttribute');
      this.render();
    }
  }

  public renderTextAttribute() {
    const { selectedPolygon } = this;
    if (!this.ctx || this.config.textConfigurable === false || !selectedPolygon) {
      return;
    }

    const { pointList, attribute, valid, textAttribute } = selectedPolygon;

    const { x, y } = pointList[pointList.length - 1];

    const newWidth = TEXT_MAX_WIDTH;
    const coordinate = AxisUtils.getOffsetCoordinate({ x, y }, this.currentPos, this.zoom);
    const toolColor = this.getColor(attribute);
    const color = valid ? toolColor?.valid.stroke : toolColor?.invalid.stroke;
    if (!this._textAttributInstance) {
      // 属性文本示例

      this._textAttributInstance = new TextAttributeClass({
        width: newWidth,
        container: this.container,
        icon: this.getTextIconSvg(attribute),
        color,
        getCurrentSelectedData: this.getCurrentSelectedData,
        updateSelectedTextAttribute: this.updateSelectedTextAttribute,
      });
    }

    if (this._textAttributInstance && !this._textAttributInstance?.isExit) {
      this._textAttributInstance.appendToContainer();
    }

    this._textAttributInstance.update(`${textAttribute}`, {
      left: coordinate.x,
      top: coordinate.y,
      color,
      width: newWidth,
    });
  }

  public renderPolygon() {
    // 1. 静态多边形

    if (this.isHidden === false) {
      this.polygonList?.forEach((polygon) => {
        if ([this.selectedID, this.editPolygonID].includes(polygon.id)) {
          return;
        }
        const { textAttribute, attribute } = polygon;
        const toolColor = this.getColor(attribute);
        const toolData = StyleUtils.getStrokeAndFill(toolColor, polygon.valid);
        const transformPointList = AxisUtils.changePointListByZoom(polygon.pointList || [], this.zoom, this.currentPos);

        DrawUtils.drawPolygonWithFillAndLine(this.canvas, transformPointList, {
          fillColor: toolData.fill,
          strokeColor: toolData.stroke,
          pointColor: 'white',
          thickness: this.style?.width ?? 2,
          lineCap: 'round',
          isClose: true,
          lineType: this.config?.lineType,
        });

        let showText = `${AttributeUtils.getAttributeShowText(attribute, this.config.attributeList) ?? ''}`;
        if (this.config?.isShowOrder && polygon?.order > 0) {
          showText = `${polygon.order} ${showText}`;
        }

        DrawUtils.drawText(this.canvas, transformPointList[0], showText, {
          color: toolData.stroke,
          ...DEFAULT_TEXT_OFFSET,
        });

        const endPoint = transformPointList[transformPointList.length - 1];

        DrawUtils.drawText(
          this.canvas,
          { x: endPoint.x + TEXT_ATTRIBUTE_OFFSET.x, y: endPoint.y + TEXT_ATTRIBUTE_OFFSET.y },
          textAttribute,
          {
            color: toolData.stroke,
            ...DEFAULT_TEXT_OFFSET,
          },
        );
      });
    }

    // 2. hover 多边形
    if (this.hoverID && this.hoverID !== this.editPolygonID) {
      const hoverPolygon = this.polygonList.find((v) => v.id === this.hoverID && v.id !== this.selectedID);
      if (hoverPolygon) {
        let color = '';
        const toolColor = this.getColor(hoverPolygon.attribute);
        if (hoverPolygon.valid) {
          color = toolColor.validHover.fill;
        } else {
          color = StyleUtils.getStrokeAndFill(toolColor, false, { isHover: true }).fill;
        }

        DrawUtils.drawPolygonWithFill(
          this.canvas,
          AxisUtils.changePointListByZoom(hoverPolygon.pointList, this.zoom, this.currentPos),
          {
            color,
            lineType: this.config?.lineType,
          },
        );
      }
    }

    // 3. 选中多边形的渲染
    if (this.selectedID) {
      const selectdPolygon = this.selectedPolygon;

      if (selectdPolygon) {
        const toolColor = this.getColor(selectdPolygon.attribute);
        const toolData = StyleUtils.getStrokeAndFill(toolColor, selectdPolygon.valid, { isSelected: true });

        DrawUtils.drawSelectedPolygonWithFillAndLine(
          this.canvas,
          AxisUtils.changePointListByZoom(selectdPolygon.pointList, this.zoom, this.currentPos),
          {
            fillColor: toolData.fill,
            strokeColor: toolData.stroke,
            pointColor: 'white',
            thickness: 2,
            lineCap: 'round',
            isClose: true,
            lineType: this.config?.lineType,
          },
        );

        let showText = `${
          AttributeUtils.getAttributeShowText(selectdPolygon.attribute, this.config.attributeList) ?? ''
        }`;
        if (this.config?.isShowOrder && selectdPolygon?.order > 0) {
          showText = `${selectdPolygon.order} ${showText}`;
        }

        DrawUtils.drawText(
          this.canvas,
          AxisUtils.changePointByZoom(selectdPolygon.pointList[0], this.zoom, this.currentPos),
          showText,
          {
            color: toolData.stroke,
            ...DEFAULT_TEXT_OFFSET,
          },
        );

        this.renderTextAttribute();
      }
    }

    const defaultColor = this.getColor(this.defaultAttribute);
    const toolData = StyleUtils.getStrokeAndFill(defaultColor, !this.isCtrl);
    // 4. 编辑中的多边形
    if (this.drawingPointList?.length > 0) {
      // 渲染绘制中的多边形
      const drawingPointList = [...this.drawingPointList];
      let coordinate = AxisUtils.getOriginCoordinateWithOffsetCoordinate(this.coord, this.zoom, this.currentPos);

      if (this.config?.edgeAdsorption && this.isAlt === false) {
        const { dropFoot } = PolygonUtils.getClosestPoint(
          coordinate,
          this.polygonList,
          this.config?.lineType,
          edgeAdsorptionScope / this.zoom,
        );
        if (dropFoot) {
          coordinate = dropFoot;
        }
      }

      drawingPointList.push(coordinate);
      DrawUtils.drawSelectedPolygonWithFillAndLine(
        this.canvas,
        AxisUtils.changePointListByZoom(drawingPointList, this.zoom, this.currentPos),
        {
          fillColor: toolData.fill,
          strokeColor: toolData.stroke,
          pointColor: 'white',
          thickness: 2,
          lineCap: 'round',
          isClose: false,
          lineType: this.config.lineType,
        },
      );
    }

    // 5. 编辑中高亮的点
    if (this.hoverPointIndex > -1 && this.selectedID) {
      const selectdPolygon = this.selectedPolygon;
      if (!selectdPolygon) {
        return;
      }
      const hoverColor = StyleUtils.getStrokeAndFill(defaultColor, selectdPolygon.valid, { isSelected: true });

      const point = selectdPolygon?.pointList[this.hoverPointIndex];
      if (point) {
        const { x, y } = AxisUtils.changePointByZoom(point, this.zoom, this.currentPos);
        DrawUtils.drawCircleWithFill(this.canvas, { x, y }, 5, {
          color: hoverColor.fill,
        });
      }
    }

    // 6. 编辑中高亮的边
    if (this.hoverEdgeIndex > -1 && this.selectedID) {
      const selectdPolygon = this.selectedPolygon;
      if (!selectdPolygon) {
        return;
      }
      const selectedColor = StyleUtils.getStrokeAndFill(defaultColor, selectdPolygon.valid, { isSelected: true });

      DrawUtils.drawLineWithPointList(
        this.canvas,
        AxisUtils.changePointListByZoom(selectdPolygon.pointList, this.zoom, this.currentPos),
        {
          color: selectedColor.stroke,
          thickness: 10,
          hoverEdgeIndex: this.hoverEdgeIndex,
          lineType: this.config?.lineType,
        },
      );
    }
  }

  public render() {
    if (!this.ctx) {
      return;
    }

    super.render();
    this.renderCursorLine(this.getLineColor(this.defaultAttribute));
    this.renderPolygon();
  }

  /** 撤销 */
  public undo() {
    if (this.drawingPointList.length > 0) {
      // 绘制中进行
      const drawingPointList = this.drawingHistory.undo();
      if (!drawingPointList) {
        return;
      }
      this.drawingPointList = drawingPointList;
      this.render();

      return;
    }

    const polygonList = this.history.undo();
    if (polygonList) {
      if (polygonList.length !== this.polygonList.length) {
        this.setSelectedID('');
      }

      this.setPolygonList(polygonList);
      this.render();
    }
  }

  /** 重做 */
  public redo() {
    if (this.drawingPointList.length > 0) {
      // 绘制中进行
      const drawingPointList = this.drawingHistory.redo();
      if (!drawingPointList) {
        return;
      }
      this.drawingPointList = drawingPointList;
      this.render();

      return;
    }

    const polygonList = this.history.redo();
    if (polygonList) {
      if (polygonList.length !== this.polygonList.length) {
        this.setSelectedID('');
      }

      this.setPolygonList(polygonList);
      this.render();
    }
  }
}

export default PolygonOperation;
