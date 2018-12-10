import attachListeners from 'fw-utils/listeners'

describe('Tools - attach listeners tests', () => {

  it('should attach functions to window object', () => {
    attachListeners()

    expect(typeof window.onbeforeunload).toBe('function')
    expect(typeof window.onkeydown).toBe('function')
  })

})
