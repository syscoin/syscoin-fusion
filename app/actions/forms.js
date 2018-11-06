// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/forms'
import {
  sendAsset,
  sendSysTransaction
} from 'fw-sys'

type editSendAssetActionType = {
  type: string,
  payload?: editSendAssetType
};

type editSendAssetType = {
  from: string,
  asset: string,
  toAddress: string,
  amount: string,
  comment?: string
};

type editSendSysActionType = {
  type: string,
  payload?: editSendSysType
};

type editSendSysType = {
  comment?: string,
  address: string,
  amount: string
};

export const editSendAssetAction = createAction(types.EDIT_SEND_ASSET_FORM)
export const editSendSysAction = createAction(types.EDIT_SEND_SYS_FORM)

export const sendAssetIsLoadingAction = createAction(types.SEND_ASSET_IS_LOADING)
export const sendAssetErrorAction = createAction(types.SEND_ASSET_ERROR)
export const sendAssetReceiveAction = createAction(types.SEND_ASSET_RECEIVE)

export const sendSysIsLoadingAction = createAction(types.SEND_SYS_IS_LOADING)
export const sendSysErrorAction = createAction(types.SEND_SYS_ERROR)
export const sendSysReceiveAction = createAction(types.SEND_SYS_RECEIVE)

export const editSendAsset = (obj: editSendAssetType) => (dispatch: (action: editSendAssetActionType) => void) => dispatch(editSendAssetAction(obj))
export const editSendSys = (obj: editSendSysType) => (dispatch: (action: editSendSysActionType) => void) => dispatch(editSendSysAction(obj))

export const sendAssetForm = () => async (dispatch: (action: editSendAssetActionType) => void, getState: Function) => {
  const { from, toAddress, asset, amount, comment } = getState().forms.sendAsset.data
  dispatch(sendAssetIsLoadingAction())

  try {
    dispatch(
      sendAssetReceiveAction(
        await sendAsset({
          amount,
          comment,
          fromAlias: from,
          toAlias: toAddress,
          assetId: asset
        })
      )
    )
  } catch (err) {
    dispatch(sendAssetErrorAction(err.message))
    return Promise.reject(err)
  }

  return Promise.resolve()
}

export const sendSysForm = (obj: editSendSysType) => async (dispatch: (action: editSendSysActionType) => void) => {
  dispatch(sendSysIsLoadingAction())

  try {
    dispatch(sendSysReceiveAction(await sendSysTransaction(obj)))
  } catch (err) {
    dispatch(sendSysErrorAction(err))
    return Promise.reject(err)
  }

  return Promise.resolve()
}
