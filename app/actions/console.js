// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/console'

export const pushToConsole = createAction(types.PUSH_TO_CONSOLE)
export const toggleConsole = createAction(types.TOGGLE_CONSOLE)
