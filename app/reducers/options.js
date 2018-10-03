// @flow
import { ALLOWED_GUIDS } from 'fw-types/options'

type actionType = {
  +type: string,
  payload?: Array<string> | Object
};

const initialState = {
  guids: []
}

export default function wallet(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case ALLOWED_GUIDS:
      return {
        ...state,
        guids: action.payload
      }
    default:
      return state
  }
}
