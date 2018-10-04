// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import { getInfo, getAliases } from 'fw-sys'
import { getUnfinishedAliases } from 'fw-utils/new-alias-manager'
import { initialState } from 'fw-reducers/wallet'

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

type saveUnfinishedAliasesActionType = {
  type: string,
  payload: Array<{
    aliasName: string,
    block: number,
    round: number
  }>
};

const saveGetInfoAction = createAction(types.WALLET_GETINFO)
const saveAliasesAction = createAction(types.WALLET_ALIASES)
const saveUnfinishedAliasesAction = createAction(types.WALLET_UNFINISHED_ALIASES)

export const saveGetInfo = () => async (dispatch: (action: getInfoActionType) => void) => {
  try {
    dispatch(saveGetInfoAction(await getInfo()))
  } catch(err) {
    dispatch(saveGetInfoAction(initialState))
  }
}

export const saveAliases = () => async (dispatch: (action: getAliasesActionType) => void) => {
  try {
    dispatch(saveAliasesAction(await getAliases()))
  } catch(err) {
    dispatch(saveAliasesAction([]))
  }
}

export const saveUnfinishedAliases = () => (dispatch: (action: saveUnfinishedAliasesActionType) => void) => {
  try {
    dispatch(saveUnfinishedAliasesAction(getUnfinishedAliases()))
  } catch(err) {
    dispatch(saveUnfinishedAliasesAction([]))
  }
}
