// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import {
  getInfo,
  getAliases,
  getBlockchainInfo,
  listSysTransactions,
  getAllTokenBalances,
  isEncrypted,
  aliasInfo,
  currentBalance
} from 'fw-sys'
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
    headers: number,
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

type saveDashboardTransactionsActionType = {
  type: string,
  payload?: Array<Object>
};

type saveDashboardAssetsActionType = {
  type: string,
  payload?: Array<Object>
};

type checkWalletEncryptionActionType = {
  type: string,
  payload: boolean
};

const saveGetInfoAction = createAction(types.WALLET_GETINFO)
const saveAliasesAction = createAction(types.WALLET_ALIASES)
const saveUnfinishedAliasesAction = createAction(types.WALLET_UNFINISHED_ALIASES)
const saveBlockchainInfoAction = createAction(types.WALLET_BLOCKCHAIN_INFO)

const dashboardAssetsIsLoadingAction = createAction(types.WALLET_DASHBOARD_ASSETS_IS_LOADING)
const dashboardAssetsErrorAction = createAction(types.WALLET_DASHBOARD_ASSETS_ERROR)
const dashboardAssetsReceiveAction = createAction(types.WALLET_DASHBOARD_ASSETS_RECEIVE)

const dashboardTransactionsIsLoadingAction = createAction(types.WALLET_DASHBOARD_TRANSACTIONS_IS_LOADING)
const dashboardTransactionsErrorAction = createAction(types.WALLET_DASHBOARD_TRANSACTIONS_ERROR)
const dashboardTransactionsReceiveAction = createAction(types.WALLET_DASHBOARD_TRANSACTIONS_RECEIVE)

const walletIsEncrypted = createAction(types.WALLET_IS_ENCRYPTED)
const walletIsUnlocked = createAction(types.WALLET_IS_UNLOCKED)

const getWalletBalanceAction = createAction(types.WALLET_BALANCE)

export const getWalletBalance = () => async (dispatch: (action) => void) => {
  try{
    dispatch(getWalletBalanceAction(await currentBalance()))
  } catch(err) {
    dispatch(getWalletBalanceAction(0))
  }
}

export const saveGetInfo = () => async (dispatch: (action: getInfoActionType) => void) => {
  try {
    dispatch(saveGetInfoAction(await getInfo()))
  } catch(err) {
    dispatch(saveGetInfoAction(initialState.getinfo))
  }
}

export const saveAliases = () => async (dispatch: (action: getAliasesActionType) => void) => {
  let aliases

  try {
    aliases = await getAliases()
  } catch(err) {
    return dispatch(saveAliasesAction([]))
  }

  aliases = aliases.map(async i => {

    if (i.alias) {
      i.aliasInfo = await aliasInfo(i.alias)
    }

    return i
  })

  try {
    aliases = await Promise.all(aliases)
  } catch(err) {
    return dispatch(saveAliasesAction([]))
  }

  aliases = aliases.map(i => {
    if (i.alias) {
      try {
        i.avatarUrl = JSON.parse(i.aliasInfo.publicvalue).avatarUrl 
      } catch(err) {
        i.avatarUrl = ''
      }
    }

    return i
  })

  return dispatch(saveAliasesAction(aliases))
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

export const dashboardTransactions = () => async (dispatch: (action: saveDashboardTransactionsActionType) => void) => {
  dispatch(dashboardTransactionsIsLoadingAction())

  try {
    return dispatch(dashboardTransactionsReceiveAction(await listSysTransactions(0, 999999)))
  } catch(err) {
    return dashboardTransactionsErrorAction(err)
  }
}

export const dashboardAssets = () => async (dispatch: (action: saveDashboardAssetsActionType) => void) => {
  let balances
  // const fixedGuids = getState().options.guids.map(i => i._id)
  dispatch(dashboardAssetsIsLoadingAction())

  try {
    balances = await getAllTokenBalances()
  } catch(err) {
    return dispatch(dashboardAssetsErrorAction(err.message))
  }
  
  dispatch(dashboardAssetsReceiveAction(balances))
}

export const checkWalletEncryption = () => async (dispatch: ((action: checkWalletEncryptionActionType) => void)) => dispatch(walletIsEncrypted(await isEncrypted()))
export const walletUnlocked = (unlocked: boolean) => async (dispatch: ((action: checkWalletEncryptionActionType) => void)) => dispatch(walletIsUnlocked(unlocked))
