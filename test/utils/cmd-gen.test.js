import cmdGen from 'fw-utils/cmd-gen'

describe('Utils - CMD Generator tests', () => {
  it('should return cmd to init syscoind with no additional params', () => {
    const cmd = cmdGen('syscoind', '')

    expect(typeof cmd).toBe('string')
    expect(cmd).toContain('syscoind')
    expect(cmd[cmd.length - 1]).toBe('e')
  })

  it('should return cmd to init cli with no additional params', () => {
    const cmd = cmdGen('cli')

    expect(typeof cmd).toBe('string')
    expect(cmd).toContain('syscoin-cli')
    expect(cmd[cmd.length - 1]).toBe(' ')
  })

  it('should return cmd to init syscoind with -reindex param', () => {
    const cmd = cmdGen('syscoind', '-reindex')

    expect(typeof cmd).toBe('string')
    expect(cmd).toContain('syscoind')
    expect(cmd).toContain('-reindex')
  })

  it('should return cmd to init syscoin-cli with getinfo param', () => {
    const cmd = cmdGen('cli', 'getinfo')

    expect(typeof cmd).toBe('string')
    expect(cmd).toContain('syscoin-cli')
    expect(cmd).toContain('getinfo')
  })

  it('should return error when providing incorrect params', () => {
    expect(() => cmdGen('', 'random')).toThrow()
  })
})