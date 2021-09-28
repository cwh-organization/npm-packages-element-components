/*
 * @Author       : CWH
 * @Date         : 2021-09-28 12:03:17
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-28 13:06:02
 * @Description  : file content
 */
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

declare module 'vue' {
  export interface GlobalComponents {
    ProBreadcrumb: typeof ProBreadcrumb
    ProCheckbox: typeof ProCheckbox
    ProCheckboxButton: typeof ProCheckboxButton
    ProColumnSetting: typeof ProColumnSetting
    ProCrud: typeof ProCrud
    ProForm: typeof ProForm
    ProLayout: typeof ProLayout
    ProLink: typeof ProLink
    ProMenu: typeof ProMenu
    ProRadio: typeof ProRadio
    ProRadioButton: typeof ProRadioButton
    ProSelect: typeof ProSelect
    ProTable: typeof ProTable
    ProTabs: typeof ProTabs
  }
}

export {}
