// @flow
import {
    SYSCOINCONF_DATADIR
} from '../actions/options'
  
  export type startUpStateType = {
    +syscoinDataDir: string
  };
  
  type actionType = {
    +type: string,
    +syscoinDataDir?: string
  };
  
  const initialState = {
    syscoinDataDir: 'default'
  }
  
  export default function startUp(
    state: startUpStateType = initialState,
    action: actionType
  ) {
    switch (action.type) {
      case SYSCOINCONF_DATADIR:
        return {
          ...state,
          syscoinDataDir: action.syscoinDataDir
        }
      default:
        return state
    }
  }
  