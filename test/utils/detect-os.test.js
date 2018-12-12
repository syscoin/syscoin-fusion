import detectOS from 'fw-utils/detect-os'

describe('Utils - detect OS tests', () => {
  switch(process.platform) {
    case 'win32':
      it('should return windows', () => {
        expect(detectOS(true)).toBe('windows')
        expect(detectOS()).toBe('win')
      })
      break
    case 'linux':
      it('should return linux', () => {
        expect(detectOS()).toBe('linux')
      })
      break
    case 'darwin':
      it('should return mac', () => {
        expect(detectOS(true)).toBe('mac')
        expect(detectOS()).toBe('osx')
      })
      break
  }
})
