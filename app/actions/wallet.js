// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import { getInfo, getAliases, getBlockchainInfo, listSysTransactions, listAssetAllocation } from 'fw-sys'
import { getUnfinishedAliases } from 'fw-utils/new-alias-manager'
import { initialState } from 'fw-reducers/wallet'
import _ from 'lodash'

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

window._ = _

export const dashboardTransactions = (page: number, pageSize: number) => async (dispatch: (action: saveDashboardTransactionsActionType) => void) => {
  dispatch(dashboardTransactionsIsLoadingAction())

  try {
    return dispatch(dashboardTransactionsReceiveAction(await listSysTransactions(page, pageSize)))
  } catch(err) {
    return dashboardTransactionsErrorAction(err)
  }
}

export const dashboardAssets = () => async (dispatch: (action: saveDashboardAssetsActionType) => void, getState: Function) => {
  dispatch(dashboardAssetsIsLoadingAction())

  const { aliases } = getState().wallet
  let assets = {}
  let allocations

  try {
    allocations = await Promise.all(
      aliases.map(i => listAssetAllocation({
        receiver_address: i.alias || i.address
      }))
    )
  } catch(err) {
    return dispatch(dashboardAssetsErrorAction(err.message))
  }

  // Generating balances per asset
  _.flatten(allocations).forEach(i => {
    if (!assets[i.asset]) {
      assets[i.asset] = {
        balance: 0,
        asset: i.asset,
        symbol: i.symbol
      }
    }

    assets[i.asset].balance += Number(i.balance)
  })

  // Turning the object into an array
  assets = Object.keys(assets).map(i => assets[i])

  dispatch(dashboardAssetsReceiveAction(assets))
}
