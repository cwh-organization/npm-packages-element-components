/*
 * @Author       : CWH
 * @Date         : 2021-09-25 11:54:02
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-27 09:56:59
 * @Description  : 头部注释
 */
import type { InstallOptions } from '../types/index';

export const config: Required<InstallOptions> = {
  pagination: {
    background: true,
    layout: 'prev, pager, next, sizes',
  },
  menu: {
    add: true,
    addText: '新增',
    addProps: { type: 'primary' },
    edit: true,
    editText: '编辑',
    editProps: { type: 'text' },
    del: true,
    delText: '删除',
    delProps: { type: 'text' },
    submit: true,
    submitText: '确认',
    submitProps: { type: 'primary' },
    reset: true,
    resetText: '重置',
    search: true,
    searchText: '查询',
    searchProps: { type: 'primary', icon: 'el-icon-search el-icon--left' },
    searchReset: true,
    searchResetText: '重置',
    resetProps: { plain: true },
  },
};
