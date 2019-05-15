// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import {
  getAddresses,
  getBlockchainInfo,
  listSysTransactions,
  getAllTokenBalances,
  isEncrypted,
  currentBalance
} from 'fw-sys'
import { getUnfinishedAliases } from 'fw-utils/new-alias-manager'
import { initialState } from 'fw-reducers/wallet'

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

export const saveAliases = () => async (dispatch: (action: getAliasesActionType) => void) => {
  let aliases

  try {
    aliases = await getAddresses()
  } catch(err) {
    return dispatch(saveAliasesAction([]))
  }

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

export const dashboardTransactions = (page = 0) => async (dispatch: (action: saveDashboardTransactionsActionType) => void) => {
  dispatch(dashboardTransactionsIsLoadingAction())

  try {
    dispatch(dashboardTransactionsReceiveAction(
      await listSysTransactions(page, Number(process.env.TABLE_PAGINATION_LENGTH))
    ))
  } catch(err) {
    dashboardTransactionsErrorAction(err)
  }
}

export const dashboardAssets = () => async (dispatch: (action: saveDashboardAssetsActionType) => void, getState: Function) => {
  const limitToAssets = getState().options.guids.map(i => i.asset_guid)
  let balances
  dispatch(dashboardAssetsIsLoadingAction())

  try {
    balances = await getAllTokenBalances()
  } catch(err) {
    return dispatch(dashboardAssetsErrorAction(err.message))
  }

  if (limitToAssets.length) {
    balances = balances.filter(i => limitToAssets.indexOf(i.asset_guid) !== -1)
  }
  
  dispatch(dashboardAssetsReceiveAction(balances))
}

export const checkWalletEncryption = () => async (dispatch: ((action: checkWalletEncryptionActionType) => void)) => dispatch(walletIsEncrypted(await isEncrypted()))
export const walletUnlocked = (unlocked: boolean) => async (dispatch: ((action: checkWalletEncryptionActionType) => void)) => dispatch(walletIsUnlocked(unlocked))
