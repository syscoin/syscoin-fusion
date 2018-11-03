// @flow
import {
  EDIT_SEND_ASSET_FORM,
  EDIT_SEND_SYS_FORM
} from 'fw-types/forms'

type actionType = {
  +type: string,
  payload ?: any
};

type StateType = {
  sendAsset: {
    from: string,
    asset: string,
    toAddress: string,
    amount: string,
    comment: string
  },
  sendSys: {
    comment: string,
    address: string,
    amount: string
  }
};

const initialState = {
  sendAsset: {
    from: '',
    asset: '',
    toAddress: '',
    amount: '',
    comment: ''
  },
  sendSys: {
    comment: '',
    address: '',
    amount: ''
  }
}

export default function forms(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case EDIT_SEND_ASSET_FORM:
      return {
        ...state,
        sendAsset: {
          ...state.sendAsset,
          ...action.payload
        }
      }
    case EDIT_SEND_SYS_FORM:
      return {
        ...state,
        sendSys: {
          ...state.sendSys,
          ...action.payload
        }
      }
    default:
      return state
  }
}
