/*
 * @Author       : CWH
 * @Date         : 2021-09-26 14:22:57
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-26 16:21:16
 * @Description  : file content
 */
import { VNodeTypes } from 'vue';

export interface IColumnEnum {
  [key: string]: { text: string; render?: (text: string) => VNodeTypes };
}
