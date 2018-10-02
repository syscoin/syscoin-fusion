// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'

type getInfoType = {
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
};

type getInfoActionType = {
  type: string,
  payload: Object
};

const saveGetInfoAction = createAction(types.WALLET_GETINFO)

export const saveGetinfo = (obj: getInfoType) => (dispatch: (action: getInfoActionType) => void) => {
  dispatch(saveGetInfoAction(obj))
}

export const saveAliases = () => ({})
