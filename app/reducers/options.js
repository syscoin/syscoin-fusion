// @flow
import { ALLOWED_GUIDS, TOGGLE_MAXIMIZE } from 'fw-types/options'

type actionType = {
  +type: string,
  payload?: Array<string> | Object
};

const initialState = {
  guids: [],
  isMaximized: false
}

export default function wallet(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case ALLOWED_GUIDS:
      return {
        ...state,
        guids: action.payload
      }
    case TOGGLE_MAXIMIZE:
      return {
        ...state,
        isMaximized: !state.isMaximized
      }
    default:
      return state
  }
}
