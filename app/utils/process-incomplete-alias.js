import {
  createNewAlias
} from 'fw-sys'
import {
  removeFinishedAlias,
  incRoundToAlias
} from 'fw-utils/new-alias-manager'

type Params = {
  unfinishedAliases: Array<Object>,
  actualBlock: number
};


export default (obj: Params) => {
    const { unfinishedAliases, actualBlock } = obj
    if (unfinishedAliases.length) {
      unfinishedAliases.forEach(async i => {
        if (i.block < actualBlock) {
          try {
            await createNewAlias({
              ...i
            })
          } catch(err) {
              if (err.message.indexOf('ERRCODE: 5505') !== -1) {
                removeFinishedAlias(i.aliasName)
              }
              return false
          }

          incRoundToAlias(i.aliasName, actualBlock)
        }
      })
    }
}
