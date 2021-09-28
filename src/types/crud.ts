/*
 * @Author       : CWH
 * @Date         : 2021-09-25 11:54:02
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-27 21:05:36
 * @Description  : 头部注释
 */
import { MaybeArray, IFormValidateFieldCallback, IFormValidateCallback } from '../types';
import type {
  FormColumn,
  IFormProps,
  IFormColumns,
  IFormMenuColumns,
  IFormExpose,
  IFormSubmit,
  TableColumn,
  ITableProps,
  ITableColumns,
  ITableMenuColumns,
  ITableExpose,
  IButtonProps,
  IDialogProps,
  UnknownObject,
  StringObject,
  ExternalParam,
} from './index';

export interface IRequestParams {
  currentPage: number;
  pageSize: number;
  queryParam: StringObject;
}

export interface IPaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface ISubmitParams {
  close(): void;
  done(): void;
  formType: ICrudFormType;
  isValid: boolean;
  invalidFields?: UnknownObject;
  fields: StringObject;
  row: StringObject;
}

export interface ICrudProps<T = ExternalParam>
  extends Partial<Omit<ITableProps<T>, 'size'>>,
    Partial<Omit<IFormProps<T>, 'menu' | 'align'>>,
    IDialogProps {
  columns?: ICrudColumns<T>;
  addColumns?: IFormColumns<T>;
  editColumns?: IFormColumns<T>;
  formColumns?: IFormColumns<T>;
  searchColumns?: IFormColumns<T>;
  tableColumns?: ITableColumns<T>;
  menu?: boolean | ICrudMenuColumns;
  search?: T;
  searchRules?: StringObject;
  beforeOpen?: ICrudBeforeOpen<T>;
  request: (params: IRequestParams) => Promise<{ total: number; data: Array<any> }>;
}

export interface CrudColumn<T = ExternalParam> extends FormColumn<T>, TableColumn<T> {
  /** sub-form and multi-level header */
  children?: ICrudColumns<T>;
  /** whether to display in the add form */
  add?: boolean;
  /** whether to display in the edit form */
  edit?: boolean;
  /** whether to display in the add and edit form */
  form?: boolean;
  /** whether to display in the search form */
  search?: boolean;
}

/** Crud Columns Options */
export type ICrudColumns<T = ExternalParam> = CrudColumn<T>[];

export interface CrudMenu<T = ExternalParam> {
  /** show add button */
  add?: boolean;
  /** text of add button */
  addText?: string;
  /** props of add button */
  addProps?: IButtonProps;
  /** show edit button */
  edit?: boolean | ((row: T) => boolean);
  /** text of edit button */
  editText?: string;
  /** props of edit button */
  editProps?: IButtonProps;
  /** show del button */
  del?: boolean | ((row: T) => boolean);
  /** text of del button */
  delText?: string;
  /** props of del button */
  delProps?: IButtonProps;
  /** show search button */
  search?: boolean;
  /** text of search button */
  searchText?: string;
  /** props of search button */
  searchProps?: IButtonProps;
  /** show search reset button */
  searchReset?: boolean;
  /** text of search reset button */
  searchResetText?: string;
  /** props of search reset button */
  searchResetProps?: IButtonProps;
}

export type ICrudMenuColumns<T = ExternalParam> = CrudMenu<T> & ITableMenuColumns & IFormMenuColumns;

export type ICrudFormType = 'add' | 'edit' | 'search';

export type ICrudBeforeOpen<T = ExternalParam> = (done: () => void, formType: ICrudFormType, row?: T) => void;

export type ICrudBeforeClose = (done: () => void) => void;

export type ICrudSearch = IFormSubmit;

export type ICrudSubmit = (close: () => void, done: () => void, formType: ICrudFormType, isValid: boolean, invalidFields?: UnknownObject) => void;

export type ICrudExpose<T = UnknownObject> = IFormExpose & ITableExpose<T>;

export interface CrudExpose<T = ExternalParam> {
  clearSelection(): void;
  toggleRowSelection(row: T, selected?: boolean): void;
  toggleAllSelection(): void;
  toggleRowExpansion(row: T, expanded?: boolean): void;
  setCurrentRow(row?: T): void;
  clearSort(): void;
  clearFilter(columnKeys?: MaybeArray<string>): void;
  doLayout(): void;
  sort(prop: string, order: string): void;
  validate(callback?: IFormValidateCallback): Promise<boolean>;
  resetFields(): void;
  clearValidate(props?: MaybeArray<string>): void;
  validateField: (props: MaybeArray<string>, cb: IFormValidateFieldCallback) => void;
  refresh(reset?: boolean): Promise<void>;
}
