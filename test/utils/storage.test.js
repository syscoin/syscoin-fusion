import Storage from 'fw-utils/storage'
import storageSchema from 'fw-utils/helpers/storage-schema'
import os from 'os'
import fs from 'fs'

describe('Utils - Storage tests', () => {
  let storage

  beforeAll(() => {
    storage = new Storage({
      configName: 'app-storage',
      defaults: { ...storageSchema },
      dataPath: os.homedir()
    })
  })

  afterAll(() => {
    fs.unlinkSync(os.homedir() + '/app-storage.json')
  })

  it('should set a key into local storage', () => {
    storage.set('test', 'test')

    expect(storage.get('test')).toBe('test')
  })

  it('should return same type as saved when getting value', () => {
    storage.set('boolean', true)
    storage.set('JSON', {
      test: true
    })
    storage.set('string', 'test')
    storage.set('number', 123)

    expect(typeof storage.get('boolean')).toBe('boolean')
    expect(typeof storage.get('JSON')).toBe('object')
    expect(typeof storage.get('string')).toBe('string')
    expect(typeof storage.get('number')).toBe('number')
  })

  it('should erase all values when using eraseAll method', () => {
    storage.set('guid', '123')
    storage.set('main_white', '123')
    storage.set('full_white', '123')
    storage.set('main_blue', '123')
    storage.set('main_background', '123')
    storage.set('accounts_background', '123')
    storage.set('asset_box_guid', '123')
    storage.set('main_red', '123')
    storage.set('main_green', '123')
    storage.set('title_color', '123')
    storage.set('splashscreen_url', '123')
    storage.set('progress_bar_color', '123')
    storage.set('background_logo', '123')

    storage.eraseAll()

    expect(storage.get('guid')).toBe('')
    expect(storage.get('main_white')).toBe('')
    expect(storage.get('full_white')).toBe('')
    expect(storage.get('main_blue')).toBe('')
    expect(storage.get('main_background')).toBe('')
    expect(storage.get('accounts_background')).toBe('')
    expect(storage.get('asset_box_guid')).toBe('')
    expect(storage.get('main_red')).toBe('')
    expect(storage.get('main_green')).toBe('')
    expect(storage.get('title_color')).toBe('')
    expect(storage.get('splashscreen_url')).toBe('')
    expect(storage.get('progress_bar_color')).toBe('')
    expect(storage.get('background_logo')).toBe('')
  })

})
