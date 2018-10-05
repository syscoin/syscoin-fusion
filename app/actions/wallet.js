// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import { getInfo, getAliases, getBlockchainInfo } from 'fw-sys'
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

type saveBlockchainInfoActionType = {
  type: string,
  payload: {
    chain: string,
    blocks: number,
    headers: numbers,
    bestblockhash: string,
    difficulty: number,
    mediantime: number,
    verificationprogress: number,
    chainwork: string,
    pruned: boolean,
    softforks: Array<Object>,
    bip9_softforks: Object
  }
};

const saveGetInfoAction = createAction(types.WALLET_GETINFO)
const saveAliasesAction = createAction(types.WALLET_ALIASES)
const saveUnfinishedAliasesAction = createAction(types.WALLET_UNFINISHED_ALIASES)
const saveBlockchainInfoAction = createAction(types.WALLET_BLOCKCHAIN_INFO)

export const saveGetInfo = () => async (dispatch: (action: getInfoActionType) => void) => {
  try {
    dispatch(saveGetInfoAction(await getInfo()))
  } catch(err) {
    dispatch(saveGetInfoAction(initialState.getinfo))
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

export const saveBlockchainInfo = () => async (dispatch: (action: saveBlockchainInfoActionType) => void) => {
  try {
    dispatch(saveBlockchainInfoAction(await getBlockchainInfo()))
  } catch(err) {
    dispatch(saveBlockchainInfoAction(initialState.blockchaininfo))
  }
}
