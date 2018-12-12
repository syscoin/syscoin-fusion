import {
  createNewAlias
} from 'fw-sys'
import {
  removeFinishedAlias,
  incRoundToAlias,
  addErrorToAlias
} from 'fw-utils/new-alias-manager'
import errorParser from 'fw-utils/error-parser'
import { each } from 'async'

type Params = {
  unfinishedAliases: Array<Object>,
  actualBlock: number
};


export default (obj: Params) => new Promise((resolve, reject) => {
  const { unfinishedAliases, actualBlock } = obj

  if (unfinishedAliases.length) {
    each(unfinishedAliases, (i, done) => {
      if (i.block < actualBlock) {

        createNewAlias({...i})
          .then(() => {
            incRoundToAlias(i.aliasName, actualBlock)
            done()
          })
          .catch(err => {
            addErrorToAlias(i.aliasName, errorParser(err.message))
            if (err.message.indexOf('ERRCODE: 5505') !== -1) {
              removeFinishedAlias(i.aliasName)
            }

            done()
          })

      }
    }, () => resolve())
  }
})
