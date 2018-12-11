import getDocPaths from 'fw-utils/get-doc-paths'
import { existsSync } from 'fs'

describe('Utils - Get Docs Paths tests', () => {

  it('should get app docs', () => {
    expect(typeof getDocPaths().appDocsPath).toBe('string')
    expect(existsSync(getDocPaths().appDocsPath)).toBeTruthy()
  })

  it('should get custom CSS path', () => {
    expect(typeof getDocPaths().customCssPath).toBe('string')
    expect(existsSync(getDocPaths().customCssPath)).toBeTruthy()
  })

  it('should get custom config path', () => {
    expect(typeof getDocPaths().confPath).toBe('string')
    expect(existsSync(getDocPaths().confPath)).toBeTruthy()
  })

})
