// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/forms'

type editSendAssetActionType = {
  type: string,
  payload: editSendAssetType
};

type editSendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string,
  comment: string
};

type editSendSysActionType = {
  type: string,
  payload: editSendSysType
};

type editSendSysType = {
  comment: string,
  address: string,
  amount: string
};

export const editSendAssetAction = createAction(types.EDIT_SEND_ASSET_FORM)
export const editSendSysAction = createAction(types.EDIT_SEND_SYS_FORM)

export const editSendAsset = (obj: editSendAssetType) => (dispatch: (action: editSendAssetActionType) => void) => dispatch(editSendAssetAction(obj))
export const editSendSys = (obj: editSendSysType) => (dispatch: (action: editSendSysActionType) => void) => dispatch(editSendSysAction(obj))
