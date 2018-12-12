import reducer, { initialState } from 'fw-reducers/console'
import * as types from 'fw-types/console'

describe('Options reducer', () => {
  it('should return initial state', () => {
    const action = {}
    expect(reducer(initialState, action)).toEqual({ ...initialState })
  })

  it('should handle TOGGLE_CONSOLE', () => {
    expect(initialState.show).toEqual(false)

    const action = {
      type: types.TOGGLE_CONSOLE
    }
    const expectedState = {
      ...initialState,
      show: true
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PUSH_TO_CONSOLE', () => {
    const action = {
      type: types.PUSH_TO_CONSOLE,
      payload: {
        cmd: 'getinfo',
        result: 'result_test',
        time: Date.now(),
        error: false
      }
    }
    const expectedState = {
      ...initialState,
      data: [action.payload],
      history: [action.payload.cmd]
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
