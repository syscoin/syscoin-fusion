// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import { getInfo } from 'fw-sys'

type getInfoActionType = {
  type: string,
  payload: {
    version: string,
    dashversion: string,
    protocolversion: number,
    walletversion: number,
    balance: number,
    privatesend_balance: number,
    blocks: number,
    timeoffset: number,
    connections: number,
    proxy: string,
    difficulty: number,
    testnet: boolean,
    keypoololdest: number,
    keypoolsize: number,
    paytxfee: number,
    relayfee: number,
    errors: string
  }
};

const saveGetInfoAction = createAction(types.WALLET_GETINFO)

export const saveGetInfo = () => async (dispatch: (action: getInfoActionType) => void) => {
  let info
  try {
    info = await getInfo()
  } catch(err) {
    return
  }

  dispatch(saveGetInfoAction(info))
}

export const saveAliases = () => ({})
