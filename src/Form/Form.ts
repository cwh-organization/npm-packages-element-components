import { computed, defineComponent, h, toRefs, VNode } from 'vue';
import { ElForm, ElFormItem, ElButton } from 'element-plus';
import { useFormMethods, useScreenSize, useFormMenu, useRow } from '../composables/index';
import props from './props';
import ProFormItem from './FormItem';
import { IColFormTypeComponent } from '../types';
import { isObject } from '@vue/shared';

export default defineComponent({
  name: 'ProForm',
  props,
  emits: ['update:modelValue', 'submit', 'reset'],
  setup(props, { slots, emit, expose }) {
    const { columns, modelValue, inline } = toRefs(props);
    const { form, loading, validate, resetFields, clearValidate, validateField, upFormData, submitForm, resetForm } = useFormMethods(emit);
    const menu = useFormMenu(props);
    const { rowStyle, rowClass } = useRow(props);
    const screenSize = useScreenSize();
    const labelPosition = computed(() => {
      return screenSize.value === 'xs' && !inline?.value ? 'top' : props.labelPosition;
    });

    expose({
      validate,
      resetFields,
      clearValidate,
      validateField,
    });

    function isFormTypeComponent(val: unknown): val is IColFormTypeComponent {
      if (val == null || typeof val === 'string') return false;
      if (isObject(val)) {
        if (val.formTypeComponent) return true;
      }
      return false;
    }

    function createColumn() {
      return (
        columns.value?.map(item => {
          const { component, props: _props, ...colProps } = item;
          const _item: typeof item = colProps;
          if (isFormTypeComponent(component)) {
            _item.component = component.formTypeComponent![props.formType || 'add']?.component;
            _item.props = { ..._props, ...component.formTypeComponent![props.formType || 'add']?.props };
          } else {
            _item.component = component;
            _item.props = _props;
          }

          // 如果是查询表单 忽略 column 的 rules 属性
          if (props.formType === 'search') {
            delete _item.rules;
          }

          return h(
            // @ts-ignore
            ProFormItem,
            {
              modelValue: modelValue.value,
              item: _item,
              prop: item.prop,
              inline: inline.value,
              'onUpdate:modelValue': upFormData,
            },
            slots,
          );
        }) || null
      );
    }

    function createMenu() {
      let list: VNode[] = [];

      const scope = { submitForm, loading: loading.value };

      if (slots['menu-left']) {
        list = list.concat(slots['menu-left'](scope));
      }
      if (menu.value.submit) {
        list.push(
          h(
            ElButton,
            {
              ...menu.value.submitProps,
              loading: loading.value,
              onClick: submitForm,
            },
            () => menu.value.submitText,
          ),
        );
      }
      if (menu.value.reset) {
        list.push(
          h(
            ElButton,
            {
              ...menu.value.resetProps,
              loading: loading.value,
              onClick: () => resetForm(),
            },
            () => menu.value.resetText,
          ),
        );
      }
      if (slots['menu-right']) {
        list = list.concat(slots['menu-right'](scope));
      }

      return h(ElFormItem, { class: 'pro-form-menu' }, () => list);
    }

    return () =>
      h(
        ElForm,
        {
          ref: form,
          model: modelValue.value,
          rules: props.rules,
          inline: inline.value,
          labelPosition: labelPosition.value,
          labelWidth: props.labelWidth,
          labelSuffix: props.labelSuffix,
          hideRequiredAsterisk: props.hideRequiredAsterisk,
          showMessage: props.showMessage,
          inlineMessage: props.inlineMessage,
          statusIcon: props.statusIcon,
          validateOnRuleChange: props.validateOnRuleChange,
          size: props.size,
          disabled: props.disabled,
          scrollToError: props.scrollToError,
          style: !inline.value ? rowStyle.value : undefined,
          class: ['pro-form', !inline.value ? rowClass.value : ''],
        },
        () => [createColumn(), slots.default, createMenu()],
      );
  },
});
