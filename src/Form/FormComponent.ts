/*
 * @Author       : CWH
 * @Date         : 2021-09-25 11:54:02
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-28 14:32:59
 * @Description  : 头部注释
 */
import { Component, computed, DefineComponent, defineComponent, h, PropType, resolveDynamicComponent, Slot } from 'vue';
import { isFunction, isObject } from '../utils/index';
import type { StringObject } from '../types/index';
import ProSelect from '../Select/Select.vue';

interface TargetEvent {
  target: {
    checked: unknown;
    value: unknown;
  };
}

export default defineComponent({
  name: 'ProFormComponent',
  components: { ProSelect },
  props: {
    modelValue: {
      type: null,
      default: undefined,
    },
    is: {
      type: [String, Object] as PropType<string | Component>,
      default: '',
    },
    slots: {
      type: [Function, Object, String],
      default: '',
    },
    enum: {
      type: Object,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    // 指定确切的 is 值
    const realIs = computed(() => {
      if (props.is) return props.is;
      if (props.enum) return 'pro-select';
      return 'el-input';
    });

    const type = computed(() => {
      return resolveDynamicComponent(realIs.value) as DefineComponent;
    });
    const prop = computed(() => {
      const _props: StringObject = {
        ...attrs,
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value: unknown) => emit('update:modelValue', value),
      };
      if (props.is === 'input' || props.is === 'select' || props.is === 'textarea') {
        if (props.is === 'select' || attrs.type === 'checkbox' || attrs.type === 'radio') {
          _props.checked = props.modelValue;
          _props.onChange = (value: TargetEvent) => emit('update:modelValue', value.target.checked);
        } else {
          _props.value = props.modelValue;
          _props.onInput = (value: TargetEvent) => emit('update:modelValue', value.target.value);
        }
        _props.modelValue = undefined;
      }

      // 设置默认 placeholder 信息
      if (_props.placeholder == null) {
        if (realIs.value === 'el-input') {
          _props.placeholder = '请输入';
        } else if (realIs.value === 'el-select' || realIs.value === 'pro-select') {
          _props.placeholder = '请选择';
        }
      }

      // 默认 clearable 设置为 true
      if (isInputOrSelect(realIs.value as string)) {
        _props.clearable = _props.clearable ?? true;
      }

      // 如果使用了 enum 且没有定义 component 和 props.data, 则使用 enum 填充 select 数据
      if (!props.is && props.enum && !_props.data) {
        _props.data = Object.entries(props.enum).map(([key, val]) => ({ label: val.text, value: key }));
      }

      return _props;
    });
    const children = computed(() => {
      if (isFunction(props.slots)) {
        return props.slots as unknown as Slot;
      } else if (isObject(props.slots)) {
        const obj: StringObject = {};

        for (const key in props.slots) {
          const value = props.slots[key];
          obj[key] = isFunction(value) ? value : () => value;
        }

        return obj;
      } else if (props.slots) {
        return () => props.slots;
      } else {
        return undefined;
      }
    });

    function isInputOrSelect(val: string): boolean {
      return val === 'el-input' || val === 'el-select' || val === 'pro-select';
    }

    return () => h(type.value, prop.value, children.value);
  },
});
