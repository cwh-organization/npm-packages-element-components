import { ComputedRef, computed, ref, unref, useSlots, Ref, Slot, reactive, InjectionKey } from 'vue';
import { useProOptions } from './index';
import { isFunction, isObject, filterDeep, objectDeepMerge, transformSubmitValue } from '../utils/index';
import type {
  ICrudProps,
  ICrudFormType,
  ICrudMenuColumns,
  IFormColumns,
  IFormMenuColumns,
  IFormSubmit,
  ITableColumns,
  UnknownObject,
  MaybeComputedRef,
  StringObject,
  IPaginationInfo,
} from '../types/index';

interface ICrudState {
  pagination: IPaginationInfo;
  queryParam: StringObject;
  tableData: any[];
  formFields: StringObject;
}

export function useCrudColumns(props: Readonly<ICrudProps>): {
  searchColumns: ComputedRef<IFormColumns | undefined>;
  tableColumns: ComputedRef<ITableColumns | undefined>;
  menuColumns: ComputedRef<ICrudMenuColumns | undefined>;
} {
  const searchColumns = computed(() => {
    return props.searchColumns ? props.searchColumns : props.columns ? filterDeep<IFormColumns>(props.columns, 'search', true, true) : undefined;
  });
  const tableColumns = computed(() => {
    return props.tableColumns ? props.tableColumns : props.columns;
  });
  const menuColumns = computed(() => {
    if (!props.menu) return undefined;
    const options = useProOptions();
    return isObject(props.menu) ? objectDeepMerge<ICrudMenuColumns>(options.menu, props.menu) : options.menu;
  });

  return {
    searchColumns,
    tableColumns,
    menuColumns,
  };
}

export function useCrudForm(
  props: Readonly<ICrudProps>,
  emit: (event: 'submit', ...args: unknown[]) => void,
  resetForm: (reset?: boolean) => void,
  state: ICrudState,
): {
  dialogVisible: Ref<boolean>;
  formType: Ref<ICrudFormType>;
  formColumns: ComputedRef<IFormColumns | undefined>;
  openForm: (type: ICrudFormType, row?: UnknownObject) => void;
  submitForm: IFormSubmit;
} {
  const rowInfo = ref<StringObject>({});
  const dialogVisible = ref(false);
  const formType = ref<ICrudFormType>('add');
  const addColumns = computed(() => {
    return props.addColumns ? props.addColumns : props.columns ? filterDeep<IFormColumns>(props.columns, 'add', true, true) : undefined;
  });
  const editColumns = computed(() => {
    return props.editColumns ? props.editColumns : props.columns ? filterDeep<IFormColumns>(props.columns, 'edit', true, true) : undefined;
  });
  const _formColumns = computed(() => {
    return props.formColumns ? props.formColumns : props.columns ? filterDeep<IFormColumns>(props.columns, 'form') : undefined;
  });
  const formColumns = computed(() => {
    return _formColumns.value && _formColumns.value.length ? _formColumns.value : formType.value === 'add' ? addColumns.value : editColumns.value;
  });
  const submitForm: IFormSubmit = (done, isValid, invalidFields) => {
    function close() {
      done();
      resetForm(true);
      dialogVisible.value = false;
    }

    emit('submit', {
      close,
      done,
      formType: formType.value,
      isValid,
      invalidFields,
      fields: { ...transformSubmitValue(state.formFields) },
      row: { ...rowInfo.value },
    });
  };

  function openForm(type: ICrudFormType, row?: UnknownObject) {
    function done() {
      formType.value = type;
      dialogVisible.value = true;
      // 临时存储 table row 数据信息，submit 时传出去
      rowInfo.value = { ...row };
      // 更新表单数据
      state.formFields = row == null ? {} : filterEditFields(row, editColumns.value || []);
    }

    if (props.beforeOpen && isFunction(props.beforeOpen)) {
      props.beforeOpen(done, type, row);
    } else {
      done();
    }
  }

  function filterEditFields(row: UnknownObject, columns: IFormColumns) {
    return Object.fromEntries(columns.map(item => [item.prop, row[item.prop]]));
  }

  return {
    dialogVisible,
    formType,
    formColumns,
    openForm,
    submitForm,
  };
}

export function useCrudSearchForm(
  emit: (event: 'update:search' | 'search' | 'searchReset', ...args: unknown[]) => void,
  menuColumns?: MaybeComputedRef<ICrudMenuColumns | undefined>,
): {
  searchMenu: ComputedRef<IFormMenuColumns>;
  searchForm: IFormSubmit;
  searchReset: () => void;
  upSearchData: (value: unknown) => void;
} {
  const searchMenu = computed<IFormMenuColumns>(() => {
    const _menuColumns = unref(menuColumns);
    const options = useProOptions();
    const menu = _menuColumns ? _menuColumns : options.menu;

    return {
      submit: menu.search,
      submitText: menu.searchText,
      submitProps: menu.searchProps,
      reset: menu.searchReset,
      resetText: menu.searchResetText,
      resetProps: menu.searchResetProps,
    };
  });

  const searchForm: IFormSubmit = (done, isValid, invalidFields) => {
    emit('search', done, isValid, invalidFields);
  };

  function searchReset() {
    emit('searchReset');
  }

  function upSearchData(value: unknown) {
    emit('update:search', value);
  }

  return {
    searchMenu,
    searchForm,
    searchReset,
    upSearchData,
  };
}

export function useCrudSlots(): {
  searchSlots: Record<string, Slot | undefined>;
  tableSlots: Record<string, Slot | undefined>;
  formSlots: Record<string, Slot | undefined>;
} {
  const slots = useSlots();
  const searchSlots: Record<string, Slot | undefined> = {};
  const tableSlots: Record<string, Slot | undefined> = {};
  const formSlots: Record<string, Slot | undefined> = {};

  for (const key in slots) {
    const item = slots[key];

    if (/^search-/.test(key)) {
      const _key = key.replace(/^search-/, '');
      searchSlots[_key] = item;
    } else if (/^search$/.test(key)) {
      searchSlots[key] = item;
    } else if (/^table-/.test(key)) {
      const _key = key.replace(/^table-/, '');
      tableSlots[_key] = item;
    } else if (/^table$/.test(key)) {
      tableSlots[key] = item;
    } else if (/\w+-header$/.test(key)) {
      tableSlots[key] = item;
    } else if (/^append$/.test(key)) {
      tableSlots[key] = item;
    } else if (/^expand$/.test(key)) {
      tableSlots[key] = item;
    } else if (/^form-/.test(key)) {
      const _key = key.replace(/^form-/, '');
      formSlots[_key] = item;
    } else if (/\w+-error$/.test(key)) {
      formSlots[key] = item;
    } else if (/\w+-label$/.test(key)) {
      formSlots[key] = item;
    } else if (/^form$/.test(key)) {
      formSlots[key] = item;
    }
  }

  return {
    searchSlots,
    tableSlots,
    formSlots,
  };
}

// export interface ICrudProvider {
//   setPagination: InjectionKey<(info?: Partial<IPaginationInfo>) => void>;
// }

// export const crudProvider: ICrudProvider = {
//   setPagination: Symbol(),
// };

const indexFunc = (index: number, currentPage: number, pageSize: number) => (currentPage - 1) * pageSize + index + 1;

export function useCrud(props: Readonly<ICrudProps>) {
  const state = reactive<ICrudState>({
    pagination: { currentPage: 1, pageSize: props.pagination?.pageSize || 20, total: 0 },
    queryParam: {},
    tableData: [],
    formFields: {},
  });

  const setPagination = ({ currentPage, pageSize }: Partial<IPaginationInfo> = {}) => {
    if (!currentPage && !pageSize) return;

    if (currentPage) {
      state.pagination.currentPage = currentPage;
    }
    if (pageSize) {
      state.pagination.pageSize = pageSize;
    }

    loadData();
  };

  const loadData = async () => {
    try {
      const { total, data } = await props.request({
        currentPage: state.pagination.currentPage,
        pageSize: state.pagination.pageSize,
        queryParam: { ...state.queryParam },
      });
      state.pagination.total = total;
      state.tableData = data;
    } catch (error) {
      state.pagination.currentPage = 1;
      state.tableData = [];
    }
  };

  const refresh = async (reset = false) => {
    if (reset) {
      state.pagination.currentPage = 1;
    }

    await loadData();
  };

  // 初始时加载 table 数据
  loadData();

  // ElTable index 属性
  const tableIndex = computed(() => {
    if (!props.index) return false;
    if (props.index === true) {
      return { label: '序号', index: indexFunc };
    }
    if (!isFunction(props.index.index)) {
      return { ...props.index, index: indexFunc };
    }

    return props.index;
  });

  return {
    state,
    tableIndex,
    loadData,
    refresh,
    setPagination,
  };
}
