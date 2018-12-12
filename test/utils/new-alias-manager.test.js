import {
  getUnfinishedAliases,
  pushNewAlias,
  removeFinishedAlias,
  incRoundToAlias,
  addErrorToAlias
} from 'fw-utils/new-alias-manager'
import Storage from 'fw-utils/storage'
import storageSchema from 'fw-utils/helpers/storage-schema'
import os from 'os'
import fs from 'fs'

global.appStorage = new Storage({
  configName: 'app-storage',
  defaults: { ...storageSchema },
  dataPath: os.homedir()
})

describe('Utils - New Alias Manager tests', () => {

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
    appStorage.set('tools', {})
  })

  it('should get all unfinished aliases', () => {
    expect(getUnfinishedAliases()).toHaveLength(6)
  })

  it('should push a new alias correctly', () => {
    pushNewAlias({
      aliasName: 'anotherTest',
      block: 500,
      round: 0
    })

    expect(getUnfinishedAliases()).toHaveLength(7)
  })

  it('should increase rounds and update block number', () => {
    incRoundToAlias('test0', 205)

    expect(getUnfinishedAliases()[0]).toEqual({
      block: 205,
      round: 1,
      aliasName: 'test0',
      error: null
    })
  })

  it('should erase alias by name', () => {
    removeFinishedAlias('test0')

    expect(getUnfinishedAliases()[0].aliasName).toBe('test1')
  })

  it('should append error to alias', () => {
    addErrorToAlias('test0', 'Test error')

    expect(getUnfinishedAliases()[0].error).toBe('Test error')
    expect(getUnfinishedAliases()[0].aliasName).toBe('test0')
  })
})
