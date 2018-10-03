// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/options'

type saveAllowedGuidsType = {
    type: string,
    payload: Array<string>
};

const saveAllowedGuids = createAction(types.ALLOWED_GUIDS)

export default (arr: Array<string>) => (dispatch: (action: saveAllowedGuidsType) => void) => {
  dispatch(saveAllowedGuids(arr))
}
