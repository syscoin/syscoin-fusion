import formChangeFormat from 'fw-utils/form-change-format'

describe('Utils - Form change format tests', () => {
  it('should get correct form state by not providing full event', () => {
    const state = formChangeFormat('value', 'name')

    expect(state).toEqual({
      name: 'value'
    })
  })

  it('should get correct form state by providing full event', () => {
    const state = formChangeFormat({
      target: {
        value: 'value',
        name: 'name'
      }
    }, 'name')

    expect(state).toEqual({
      name: 'value'
    }) 
  })
})