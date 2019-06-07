// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/options'
import i18n from 'fw-utils/i18n'

type saveAllowedGuidsType = {
    type: string,
    payload: Array<Object>
};

type toggleMaximizeActionType = {
  type: string
};

type changeLanguageActionType = {
  type: string,
  payload: string
}

const saveAllowedGuids = createAction(types.ALLOWED_GUIDS)
const toggleMaximizeAction = createAction(types.TOGGLE_MAXIMIZE)
const changeLanguageAction = createAction(types.CHANGE_LANGUAGE)

export const saveGuids = (arr: Array<Object>) => (dispatch: (action: saveAllowedGuidsType) => void) => {
  dispatch(saveAllowedGuids(arr))
}

export const toggleMaximize = (isMaximized?: boolean) => (dispatch: (action: toggleMaximizeActionType) => void) => {
  dispatch(toggleMaximizeAction(isMaximized))
}

export const changeLanguage = (lang: string) => (dispatch: (action: toggleMaximizeActionType) => void) => {
  i18n.changeLanguage(lang)
  dispatch(changeLanguageAction(lang))
}
