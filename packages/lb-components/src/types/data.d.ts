import { ESubmitType } from '@/constant';

/** 标注文件对象 */
export interface IFileItem {
  id: number;
  url?: string;
  result?: string;
}
export type AnnotationFileList = IFileItem[];
export interface KVObject { [key: string]: any }

export type OnSubmit = (data: AnnotationFileList, submitType: ESubmitType, imgIndex: number) => void;
export type OnSave = (data: IFileItem, imgIndex: number, imgList:AnnotationFileList) => void;
export type GetFileData = (nextFileData: IFileItem, nextIndex: number) => Promise<KVObject>;
