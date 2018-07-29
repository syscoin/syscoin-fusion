// @flow
import {
  SYSCOINCONF_ERROR,
  RELOAD_CONF,
  SUCCESS_START
} from '../actions/startup'

export type startUpStateType = {
  +error: boolean | null,
  +success: boolean | null,
  +shouldReload: boolean,
  +walletInfo?: Object,
  +initMessage?: string
};

type actionType = {
  +type: string,
  +walletInfo?: Object,
  +walletMessage?: string
};

const initialState = {
  error: false,
  success: null,
  shouldReload: false,
  walletInfo: {},
  initMessage: ''
}

export default function startUp(
  state: startUpStateType = initialState,
  action: actionType
) {
  switch (action.type) {
    case SYSCOINCONF_ERROR:
      return {
        ...state,
        error: true
      }
    case RELOAD_CONF:
      return {
        ...state,
        error: true,
        shouldReload: true,
        initMessage: action.walletMessage
      }
    case SUCCESS_START:
      return {
        ...state,
        walletInfo: action.walletInfo,
        success: true
      }
    default:
      return state
  }
}
