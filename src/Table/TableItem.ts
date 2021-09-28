/*
 * @Author       : CWH
 * @Date         : 2021-09-26 09:27:29
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-26 17:26:03
 * @Description  : file content
 */
import { defineComponent, h, inject, toRefs, PropType, Slot, VNode, VNodeTypes } from 'vue';
import { ElTableColumn } from 'element-plus';
import { useTableBind } from '../composables';
import { isFunction } from '../utils/index';
import ProTableItem from './TableItem';
import type { TableColumn, ITableColumns, TableColumnsProps } from '../types/index';

interface ColumnScope {
  row: Record<string, unknown>;
}

export default defineComponent({
  name: 'ProTableItem',
  props: {
    item: {
      type: Object as PropType<TableColumn>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { item } = toRefs(props);
    const defaultBind = inject<TableColumnsProps>('defaultBind');
    const bindColumn = useTableBind<TableColumn>(item, defaultBind);

    function createHeader(scope: unknown) {
      if (slots[item.value.prop + '-header']) {
        return (slots[item.value.prop + '-header'] as Slot)(scope);
      } else {
        return item.value.label;
      }
    }

    function createDefault(scope: ColumnScope) {
      const list: Array<VNode | VNode[] | string | VNodeTypes> = [];

      if (item.value.children && item.value.children.length) {
        const child = (item.value.children as ITableColumns).map(item => {
          return h(ProTableItem, { item }, slots);
        });
        list.push(child);
      } else if (slots[item.value.prop]) {
        list.push((slots[item.value.prop] as Slot)(scope));
      } else if (item.value.render) {
        list.push(isFunction(item.value.render) ? item.value.render(scope.row) : String(item.value.render));
      } else {
        const { enum: itemEnum, prop } = item.value;
        // 如果 column 设置了枚举，则优先使用枚举中定义的值
        if (itemEnum) {
          const enumItem = itemEnum[String(scope.row[prop])];
          if (enumItem) {
            // 优先使用用户定义的渲染函数
            if (isFunction(enumItem.render)) {
              list.push(enumItem.render(String(scope.row[prop])));
            } else {
              list.push(enumItem.text);
            }
          } else {
            list.push(String(scope.row[prop]));
          }
        } else {
          list.push(String(scope.row[prop]));
        }
      }

      return list;
    }

    return () =>
      h(ElTableColumn, bindColumn.value, {
        header: (scope: unknown) => createHeader(scope),
        default: (scope: ColumnScope) => createDefault(scope),
      });
  },
});
