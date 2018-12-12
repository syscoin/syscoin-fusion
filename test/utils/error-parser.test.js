import errorParse from 'fw-utils/error-parser'

describe('Utils - Error Parser tests', () => {
  it('should get a formatted error message', () => {
    let message = errorParse('ERRCODE: 1039 Test error')
    expect(message).toBe('ERRCODE: 1039 Test error')

    message = errorParse('error message: Test error')
    expect(message).toBe('Test error')
  })
})
