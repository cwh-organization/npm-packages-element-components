/*
 * @Author       : CWH
 * @Date         : 2021-09-25 11:54:02
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-26 09:43:32
 * @Description  : 头部注释
 */
import { isArray, isFunction } from './index';

type ListDeep<T> = Array<{
  children?: T;
  [key: string]: unknown;
}>;

/**
 * deep filter list
 * @param list list to be filter
 * @param key check key
 * @param value check the value is true or false
 * @param defaultValue 当属性值是 null or undefined 使用此默认值
 */
export function filterDeep<T extends ListDeep<T>>(list: T, key: string, value = true, defaultValue = false): T {
  const _list = [] as unknown as T;
  for (let i = 0; i < list.length; i++) {
    const item = { ...list[i] };
    const isFilter = value ? item[key] ?? defaultValue : !item[key];
    if (isFilter) {
      if (item.children && item.children.length) {
        item.children = filterDeep(item.children, key, value, defaultValue);
      }
      _list.push(item);
    }
  }
  return _list;
}

/**
 * deeply find the `key` in the list and convert them into a single-level array
 * @param list list
 * @param key key
 * @param value key value, default: true
 * @param reItem rewrite value of list item
 */
export function filterFlat<T extends ListDeep<T>, Q extends unknown[] = T>(
  list: T,
  key: string,
  value = true,
  reItem?: (item: T[number]) => Q[number],
): Q {
  if (!isArray(list)) return [] as unknown as Q;

  return list.reduce((all, item) => {
    const _item = { ...item };
    let _list = [] as unknown as Q;
    if (_item.children && _item.children.length) {
      _list = filterFlat(_item.children, key, value, reItem);
      _item.children = undefined;
    }
    if (!!_item[key] === value) {
      _list.unshift(isFunction(reItem) ? reItem(_item) : _item);
    }
    return [...all, ..._list] as Q;
  }, [] as unknown as Q);
}
