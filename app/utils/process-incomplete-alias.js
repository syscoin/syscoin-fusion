import {
  createNewAlias
} from 'fw-sys'
import {
  removeFinishedAlias,
  incRoundToAlias,
  addErrorToAlias
} from 'fw-utils/new-alias-manager'
import errorParser from 'fw-sys/error-parser'

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
        } catch (err) {
          addErrorToAlias(i.aliasName, errorParser(err.message))
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
