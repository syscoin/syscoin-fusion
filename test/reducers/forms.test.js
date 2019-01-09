import reducer, { initialState } from 'fw-reducers/forms'
import * as types from 'fw-types/forms'

describe('Forms reducer', () => {

  it('should return inital state', () => {
    const action = {}
    expect(reducer(initialState, action)).toEqual({ ...initialState })
  })

  it('should handle EDIT_SEND_ASSET_FORM', () => {
    const payload = {
      from: 'testAddress',
      asset: 'testAsset',
      toAddress: 'testAddress2',
      amount: '999.99',
      comment: 'comment'
    }
    const action = {
      type: types.EDIT_SEND_ASSET_FORM,
      payload
    }
    const expectedState = {
      ...initialState,
      sendAsset: {
        ...initialState.sendAsset,
        data: { ...payload }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle EDIT_SEND_SYS_FORM', () => {
    const payload = {
      address: 'testAddress2',
      amount: '999.99',
      comment: 'comment'
    }
    const action = {
      type: types.EDIT_SEND_SYS_FORM,
      payload
    }
    const expectedState = {
      ...initialState,
      sendSys: {
        ...initialState.sendSys,
        data: { ...payload }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SEND_ASSET_IS_LOADING', () => {
    const action = {
      type: types.SEND_ASSET_IS_LOADING
    }
    const expectedState = {
      ...initialState,
      sendAsset: {
        ...initialState.sendAsset,
        isLoading: true,
        error: false
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SEND_ASSET_RECEIVE', () => {
    const action = {
      type: types.SEND_ASSET_RECEIVE
    }
    const expectedState = {
      ...initialState,
      sendAsset: {
        ...initialState.sendAsset,
        isLoading: false,
        error: false
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SEND_ASSET_ERROR', () => {
    const action = {
      type: types.SEND_ASSET_ERROR,
      payload: 'Error test'
    }
    const expectedState = {
      ...initialState,
      sendAsset: {
        ...initialState.sendAsset,
        isLoading: false,
        error: true
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SEND_SYS_IS_LOADING', () => {
    const action = {
      type: types.SEND_SYS_IS_LOADING
    }
    const expectedState = {
      ...initialState,
      sendSys: {
        ...initialState.sendSys,
        isLoading: true,
        error: false
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SEND_SYS_RECEIVE', () => {
    const action = {
      type: types.SEND_SYS_RECEIVE
    }
    const expectedState = {
      ...initialState,
      sendSys: {
        ...initialState.sendSys,
        isLoading: false,
        error: false
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SEND_SYS_ERROR', () => {
    const action = {
      type: types.SEND_SYS_ERROR,
      payload: 'Error test'
    }
    const expectedState = {
      ...initialState,
      sendSys: {
        ...initialState.sendSys,
        isLoading: false,
        error: true
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle GET_ASSETS_FROM_ALIAS_IS_LOADING', () => {
    const action = {
      type: types.GET_ASSETS_FROM_ALIAS_IS_LOADING
    }
    const expectedState = {
      ...initialState,
      sendAsset: {
        ...initialState.sendAsset,
        states: {
          ...initialState.sendAsset.states,
          assetsFromAlias: {
            isLoading: true,
            error: false,
            data: []
          }
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle GET_ASSETS_FROM_ALIAS_RECEIVE', () => {
    const action = {
      type: types.GET_ASSETS_FROM_ALIAS_RECEIVE,
      payload: [{ asset: 'test_asset', symbol: 'TEST_ASSET' }]
    }
    const expectedState = {
      ...initialState,
      sendAsset: {
        ...initialState.sendAsset,
        states: {
          ...initialState.sendAsset.states,
          assetsFromAlias: {
            isLoading: false,
            error: false,
            data: action.payload
          }
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle GET_ASSETS_FROM_ALIAS_ERROR', () => {
    const action = {
      type: types.GET_ASSETS_FROM_ALIAS_ERROR,
      payload: new Error()
    }
    const expectedState = {
      ...initialState,
      sendAsset: {
        ...initialState.sendAsset,
        states: {
          ...initialState.sendAsset.states,
          assetsFromAlias: {
            isLoading: false,
            error: true,
            data: []
          }
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SEND_CHANGE_TAB', () => {
    const action = {
      type: types.SEND_CHANGE_TAB,
      payload: 'test'
    }
    const expectedState = {
      ...initialState,
      sendTab: {
        activeTab: 'test'
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
