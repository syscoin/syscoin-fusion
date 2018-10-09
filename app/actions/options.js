// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/options'

type saveAllowedGuidsType = {
    type: string,
    payload: Array<string>
};

type toggleMaximizeActionType = {
  type: string
};

const saveAllowedGuids = createAction(types.ALLOWED_GUIDS)
const toggleMaximizeAction = createAction(types.TOGGLE_MAXIMIZE)

export const saveGuids = (arr: Array<string>) => (dispatch: (action: saveAllowedGuidsType) => void) => {
  dispatch(saveAllowedGuids(arr))
}

export const toggleMaximize = () => (dispatch: (action: toggleMaximizeActionType) => void) => {
  dispatch(toggleMaximizeAction())
}
