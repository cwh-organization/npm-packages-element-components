/*
 * @Author       : CWH
 * @Date         : 2021-09-28 12:03:17
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-28 13:03:47
 * @Description  : file content
 */
export * from './composables/index'
export * from './utils/index'
export * from './types/index'
import type { App } from 'vue'
import type { InstallOptions } from './types/index'

import ProBreadcrumb from './Breadcrumb/index'
import ProCheckbox from './Checkbox/index'
import ProCheckboxButton from './CheckboxButton/index'
import ProColumnSetting from './ColumnSetting/index'
import ProCrud from './Crud/index'
import ProForm from './Form/index'
import ProLayout from './Layout/index'
import ProLink from './Link/index'
import ProMenu from './Menu/index'
import ProRadio from './Radio/index'
import ProRadioButton from './RadioButton/index'
import ProSelect from './Select/index'
import ProTable from './Table/index'
import ProTabs from './Tabs/index'

const components = [
  ProBreadcrumb,
  ProCheckbox,
  ProCheckboxButton,
  ProColumnSetting,
  ProCrud,
  ProForm,
  ProLayout,
  ProLink,
  ProMenu,
  ProRadio,
  ProRadioButton,
  ProSelect,
  ProTable,
  ProTabs,
]

const install = (app: App, options?: InstallOptions): void => {
  options && (app.config.globalProperties.$PROOPTIONS = options)

  components.forEach((item) => {
    app.component(item.name, item)
  })
}

export default { install }
export {
  ProBreadcrumb,
  ProCheckbox,
  ProCheckboxButton,
  ProColumnSetting,
  ProCrud,
  ProForm,
  ProLayout,
  ProLink,
  ProMenu,
  ProRadio,
  ProRadioButton,
  ProSelect,
  ProTable,
  ProTabs,
  install,
}
