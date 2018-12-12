import replaceColorPalette from 'fw-utils/replace-color-palette'
import Storage from 'fw-utils/storage'
import storageSchema from 'fw-utils/helpers/storage-schema'
import os from 'os'
import fs from 'fs'


describe('Utils - Replace Color Palette tests', () => {
  let bodyCss

  beforeAll(() => {
    document.body.appendChild(document.createElement('link'))

    global.appStorage = new Storage({
      configName: 'app-storage',
      defaults: { ...storageSchema },
      dataPath: os.homedir()
    })

    const css = `
body {
  test: #ddd;
  test2: #fff;
}    
`
    appStorage.set('main_white', '#333')
    appStorage.set('full_white', '#555')

    replaceColorPalette(css)
  })

  afterAll(() => {
    fs.unlinkSync(path)
  })

  beforeEach(() => {
    bodyCss = document.querySelectorAll('style')[0].innerHTML
  })

  it('should have replaced colors with custom ones', () => {
    expect(bodyCss).toContain('test: #333')
    expect(bodyCss).toContain('test2: #555')
  })
})