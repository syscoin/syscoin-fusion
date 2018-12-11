import processIncompleteAlias from 'fw-utils/process-incomplete-alias'
import { pushNewAlias, getUnfinishedAliases } from 'fw-utils/new-alias-manager'
import Storage from 'fw-utils/storage'
import storageSchema from 'fw-utils/helpers/storage-schema'
import os from 'os'
import fs from 'fs'

describe('Utils - Process incomplete aliases tests', () => {

  beforeAll(() => {
    global.appStorage = new Storage({
      configName: 'app-storage',
      defaults: { ...storageSchema },
      dataPath: os.homedir()
    })
  })

  afterAll(() => {
    fs.unlinkSync(os.homedir() + '/app-storage.json')
  })

  beforeEach(() => {
    for (let i = 0; i <= 5; i++) {
      pushNewAlias({
        aliasName: 'test' + i,
        block: 200 + i,
        round: 0
      })
    }
  })

  afterEach(() => {

  })

  it('should attempt to process aliases and append error to each one on fail', () => {
    expect(true).toBe(true)
    // TODO
  })

})