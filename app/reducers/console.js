// @flow
import {
  TOGGLE_CONSOLE,
  PUSH_TO_CONSOLE
} from 'fw-types/console'

type actionType = {
  +type: string,
  payload ?: any
};

type LogItem = {
  cmd: string,
  result: any,
  time: number
};

type StateType = {
  show: boolean,
  data: Array<LogItem>,
  history: Array<LogItem>
};

export const initialState = {
  show: false,
  data: [],
  history: []
}

export default function console(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case TOGGLE_CONSOLE:
      return {
        ...state,
        show: !state.show
      }
    case PUSH_TO_CONSOLE:
      return {
        ...state,
        data: state.data.concat([action.payload]),
        history: state.history.concat([action.payload])
      }
    default:
      return state
  }
}
