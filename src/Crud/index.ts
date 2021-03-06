/*
 * @Author       : CWH
 * @Date         : 2021-09-26 09:27:29
 * @LastEditors  : CWH
 * @LastEditTime : 2021-09-26 11:32:36
 * @Description  : file content
 */
import type { App } from 'vue'
import { objectDeepMerge } from '../utils/index'
import ProCrud from './Crud'
import type { InstallOptions, IDefinePlugin } from '../types/index'

const _ProCrud: IDefinePlugin<typeof ProCrud> = ProCrud as IDefinePlugin<
  typeof ProCrud
>

_ProCrud.install = (app: App, options?: InstallOptions) => {
  if (options) {
    const _before = app.config.globalProperties.$PROOPTIONS as InstallOptions
    const _options = _before
      ? objectDeepMerge<InstallOptions>(_before, options)
      : options
    app.config.globalProperties.$PROOPTIONS = _options
  }

  app.component(_ProCrud.name, _ProCrud)
}

export default _ProCrud
