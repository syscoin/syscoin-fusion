// @flow
import { ALLOWED_GUIDS, TOGGLE_MAXIMIZE } from 'fw-types/options'

type actionType = {
  +type: string,
  payload?: any
};

export const initialState = {
  guids: [],
  isMaximized: false
}

type StateType = {
  guids: Array<Object>,
  isMaximized: boolean
};

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
        isMaximized: action.payload
      }
    default:
      return state
  }
}
