// @flow
import { ALLOWED_GUIDS, TOGGLE_MAXIMIZE, CHANGE_LANGUAGE } from 'fw-types/options'

type actionType = {
  +type: string,
  payload?: any
};

export const initialState = {
  guids: [],
  isMaximized: false,
  language: 'en_US'
}

type StateType = {
  guids: Array<Object>,
  isMaximized: boolean,
  language: string
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
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.payload
      }
    default:
      return state
  }
}
