import loadCss from 'fw-utils/load-css'
import os from 'os'
import fs from 'fs'

describe('Utils - Load CSS tests', () => {
  let path

  beforeAll(() => {
    const css = `
    body {
      background: red;
    }
    `
    path = os.homedir() + '/custom.css'

    fs.writeFileSync(path, css)
  })

  afterAll(() => {
    fs.unlinkSync(path)
  })

  it('should load custom CSS and put write it into body', () => {
    loadCss(path)

    expect(document.body.querySelectorAll('style')[0].innerHTML).toContain('background: red;')
  })
})