import loadConfigIntoDev from 'fw-utils/load-conf-into-dev'
import Storage from 'fw-utils/storage'
import storageSchema from 'fw-utils/helpers/storage-schema'
import os from 'os'
import fs from 'fs'
import { spy } from 'sinon'

describe('Utils - Load config tests', () => {
  let path
  let mockCb = spy()

  beforeAll(() => {
    global.appStorage = new Storage({
      configName: 'app-storage',
      defaults: { ...storageSchema },
      dataPath: os.homedir()
    })

    const customConfig = `
test=value
test_two=value_two
guid=value0,value1,value2
`

    path = os.homedir() + '/test.cfg'

    fs.writeFileSync(path, customConfig)

    loadConfigIntoDev(path, mockCb)
  })

  afterAll(() => {
    fs.unlinkSync(path)
  })

  it('should be able to read custom variables', () => {
    expect(appStorage.get('test')).toBe('value')
    expect(appStorage.get('test_two')).toBe('value_two')
    expect(appStorage.get('guid')).toEqual(['value0', 'value1', 'value2'])
  })

  it('should have called callback once finished loading variables', () => {
    expect(mockCb.called).toBeTruthy()
  })

})