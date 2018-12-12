import reducer, { initialState } from 'fw-reducers/options'
import * as types from 'fw-types/options'

describe('Options reducer', () => {
  it('should return initial state', () => {
    const action = {}
    expect(reducer(initialState, action)).toEqual({ ...initialState })
  })

  it('should handle ALLOWED_GUIDS', () => {
    const action = {
      type: types.ALLOWED_GUIDS,
      payload: ['0c9df9a04d306e02']
    }
    const expectedState = {
      ...initialState,
      guids: action.payload
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle TOGGLE_MAXIMIZE', () => {
    const action = {
      type: types.TOGGLE_MAXIMIZE,
      payload: true
    }
    const expectedState = {
      ...initialState,
      isMaximized: true
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
