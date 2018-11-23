// @flow
import {
  EDIT_SEND_ASSET_FORM,
  EDIT_SEND_SYS_FORM,
  SEND_ASSET_IS_LOADING,
  SEND_ASSET_RECEIVE,
  SEND_ASSET_ERROR,
  SEND_SYS_IS_LOADING,
  SEND_SYS_RECEIVE,
  SEND_SYS_ERROR
} from 'fw-types/forms'

type actionType = {
  +type: string,
  payload ?: any
};

type StateType = {
  sendAsset: {
    data: {
      from: string,
      asset: string,
      toAddress: string,
      amount: string,
      comment: string
    },
    isLoading: boolean,
    error: boolean
  },
  sendSys: {
    data: {
      comment: string,
      address: string,
      amount: string
    },
    isLoading: boolean,
    error: boolean
  }
};

export const initialState = {
  sendAsset: {
    data: {
      from: '',
      asset: '',
      toAddress: '',
      amount: '',
      comment: ''
    },
    isLoading: false,
    error: false
  },
  sendSys: {
    data: {
      comment: '',
      address: '',
      amount: ''
    },
    isLoading: false,
    error: false
  }
}

export default function forms(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case EDIT_SEND_ASSET_FORM:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          data: {
            ...action.payload
          }
        }
      }
    case EDIT_SEND_SYS_FORM:
      return {
        ...state,
        sendSys: {
          ...state.sendSys,
          data: {
            ...action.payload
          }
        }
      }
    case SEND_ASSET_IS_LOADING:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          isLoading: true,
          error: false
        }
      }
    case SEND_ASSET_RECEIVE:
      return {
        ...state,
        sendAsset: {
          data: {
            ...initialState.sendAsset.data
          },
          isLoading: false,
          error: false
        }
      }
    case SEND_ASSET_ERROR:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          isLoading: false,
          error: true
        }
      }
    case SEND_SYS_IS_LOADING:
      return {
        ...state,
        sendSys: {
          ...state.sendSys,
          isLoading: true,
          error: false
        }
      }
    case SEND_SYS_RECEIVE:
      return {
        ...state,
        sendSys: {
          data: {
            ...initialState.sendSys.data
          },
          isLoading: false,
          error: false
        }
      }
    case SEND_SYS_ERROR:
      return {
        ...state,
        sendSys: {
          ...state.sendSys,
          isLoading: false,
          error: true
        }
      }
    default:
      return state
  }
}
