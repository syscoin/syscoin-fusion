import {
  createNewAlias
} from 'fw-sys'
import {
  removeFinishedAlias,
  incRoundToAlias
} from 'fw-utils/new-alias-manager'
import { configureStore } from 'fw/store/configureStore'


export default () => {
  try {
    const actualBlock = configureStore().getState().wallet.getinfo.blocks
    const unfinishedAliases = global.appStorage.get('tools').newAliases
    if (unfinishedAliases) {
      unfinishedAliases.forEach(i => {
        if (i.block < actualBlock) {
          createNewAlias({
            aliasName: i.alias
          }, (err) => {
            if (err) {
              if (err.message.indexOf('ERRCODE: 5505') !== -1) {
                removeFinishedAlias(i.alias)
              }
              return false
            }

            incRoundToAlias(i.alias)
          })
        }
      })
    }
  } catch (e) {
    console.log(e)
    return false
  }
}