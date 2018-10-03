// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import { getInfo, getAliases } from 'fw-sys'

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

type getAliasesActionType = {
  type: string,
  payload: Array<{
    address: string,
    balance: number,
    label: string,
    alias: string,
    change: boolean
  }>
};

const saveGetInfoAction = createAction(types.WALLET_GETINFO)
const saveAliasesAction = createAction(types.WALLET_ALIASES)

export const saveGetInfo = () => async (dispatch: (action: getInfoActionType) => void) => {
  try {
    dispatch(saveGetInfoAction(await getInfo()))
  } catch(err) {
    console.log(err)
  }
}

export const saveAliases = () => async (dispatch: (action: getAliasesActionType) => void) => {
  try {
    dispatch(saveAliasesAction(await getAliases()))
  } catch(err) {
    console.log(err)
  }
}
