// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/options'

type saveAllowedGuidsType = {
    type: string,
    payload: Array<Object>
};

type toggleMaximizeActionType = {
  type: string
};

const saveAllowedGuids = createAction(types.ALLOWED_GUIDS)
const toggleMaximizeAction = createAction(types.TOGGLE_MAXIMIZE)

export const saveGuids = (arr: Array<Object>) => (dispatch: (action: saveAllowedGuidsType) => void) => {
  dispatch(saveAllowedGuids(arr))
}

export const toggleMaximize = (isMaximized?: boolean) => (dispatch: (action: toggleMaximizeActionType) => void) => {
  dispatch(toggleMaximizeAction(isMaximized))
}
