import {
  AnnotationEngine,
  RectOperation,
  TagOperation,
  TextToolOperation,
  PointOperation,
  PolygonOperation,
  LineToolOperation,
} from '@labelbee/lb-annotation';
import { ANNOTATION_ACTIONS } from '@/store/Actions';
import { IStepInfo } from '@/types/step';
import { OnSubmit, IFileItem, GetFileData, OnSave } from '@/types/data';
import { ESubmitType } from '@/constant';

export type GraphToolInstance =
  | RectOperation
  | PointOperation
  | PolygonOperation
  | LineToolOperation;

export type ToolInstance = GraphToolInstance | TagOperation | TextToolOperation;

interface CommonActions {
  type: string;
  payload?: any;
}

export interface AnnotationState {
  toolInstance: ToolInstance | null;
  annotationEngine: AnnotationEngine | null;
  imgList: IFileItem[];
  config: string;
  imgIndex: number;
  imgPageSize: number;
  step: number;
  stepList: IStepInfo[];
  imgNode: HTMLImageElement;
  onSubmit?: OnSubmit;
  onSave?: OnSave;
  getFileData?: GetFileData;
  basicIndex: number;
  basicResultList: any[];
  resultList: any[];
  stepProgress: number;
  loading: boolean; // 用于图片加载
  /** 阻止文件切换后的事件 */
  triggerEventAfterIndexChanged: boolean;
}

interface UpdateToolInstance {
  type: typeof ANNOTATION_ACTIONS.UPDATE_TOOL_INSTANCE;
  payload: {
    toolInstance: ToolInstance;
    annotationEngine: AnnotationEngine;
  };
}

interface UpdateImgList {
  type: typeof ANNOTATION_ACTIONS.UPDATE_IMG_LIST;
  payload: {
    imgList: IFileItem[];
  };
}

interface UpdateAnnotationConfig {
  type: typeof ANNOTATION_ACTIONS.UPDATE_ANNOTATION_CONFIG;
  payload: {
    config: string;
  };
}

interface SubmitFileData extends CommonActions {
  type: typeof ANNOTATION_ACTIONS.SUBMIT_FILE_DATA;
  payload: {
    submitType: ESubmitType;
  };
}

interface LoadFileData extends CommonActions {
  type: typeof ANNOTATION_ACTIONS.LOAD_FILE_DATA;
  payload: {
    nextIndex: number;
  };
}

interface SetTaskConfig {
  type: typeof ANNOTATION_ACTIONS.SET_TASK_CONFIG;
  payload: {
    stepList: IStepInfo[];
    step: number;
  };
}
interface InitTool {
  type: typeof ANNOTATION_ACTIONS.INIT_TOOL;
  payload: {
    stepList: IStepInfo[];
    step: number;
  };
}

interface UpdateOnSubmit {
  type: typeof ANNOTATION_ACTIONS.UPDATE_ON_SUBMIT;
  payload: {
    onSubmit: OnSubmit;
  };
}

interface UpdateOnSave {
  type: typeof ANNOTATION_ACTIONS.UPDATE_ON_SAVE;
  payload: {
    onSave: OnSave;
  };
}

interface UpdateGetFileData {
  type: typeof ANNOTATION_ACTIONS.UPDATE_GET_FILE_DATA;
  payload: {
    getFileData: GetFileData;
  };
}

interface CopyBackWordResult extends CommonActions {
  type: typeof ANNOTATION_ACTIONS.COPY_BACKWARD_RESULT;
}

export type AnnotationActionTypes =
  | UpdateToolInstance
  | UpdateImgList
  | UpdateAnnotationConfig
  | SubmitFileData
  | LoadFileData
  | SetTaskConfig
  | InitTool
  | UpdateOnSubmit
  | UpdateGetFileData
  | CopyBackWordResult
  | UpdateOnSave;
