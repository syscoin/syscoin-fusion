// @flow
import { createAction } from 'redux-actions'
import * as types from 'fw-types/wallet'
import { getInfo, getAliases, getBlockchainInfo, listSysTransactions, listAssetAllocation, isEncrypted, getBlockByNumber } from 'fw-sys'
import { getUnfinishedAliases } from 'fw-utils/new-alias-manager'
import { initialState } from 'fw-reducers/wallet'
import _ from 'lodash'
import each from 'async/each'
import moment from 'moment'

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
  const fixedGuids = getState().options.guids.map(i => i._id)
  let assets = {}
  let allocations = []

  try {
    const promises = aliases.map(
      alias => listAssetAllocation(
        {
          receiver_address: alias.alias || alias.address
        },
        fixedGuids)
    )

    const allocs = await Promise.all(promises)

    allocs.forEach(i => {
      allocations = allocations.concat(i)
    })
  } catch(err) {
    return dispatch(dashboardAssetsErrorAction(err.message))
  }

  // Generating balances per asset
  each(_.flatten(allocations), async (i, done) => {
    if (!assets[i.asset]) {
      assets[i.asset] = {
        balance: 0,
        accumulated_interest: 0,
        asset: i.asset,
        symbol: i.symbol,
        interestData: []
      }
    }

    const lastInterestClaimBlock = await getBlockByNumber(i.interest_claim_height)

    assets[i.asset].balance += Number(i.balance)

    assets[i.asset].interestData.push({
      lastClaimedInterest: i.interest_rate > 0 ? (new Date(0)).setUTCSeconds(lastInterestClaimBlock.time) : moment.now(),
      accumulatedInterest: Number(i.accumulated_interest),
      alias: i.alias
    })

    done()
  }, () => {
    // Turning the object into an array
    assets = Object.keys(assets).map(i => assets[i])

    if (fixedGuids.length) {
      // Filtering out guids not present in fusion.cfg
      assets = assets.filter(i => fixedGuids.indexOf(i.asset) !== -1)
    }

    dispatch(dashboardAssetsReceiveAction(assets))
  })

}

export const checkWalletEncryption = () => async (dispatch: ((action: checkWalletEncryptionActionType) => void)) => dispatch(walletIsEncrypted(await isEncrypted()))
export const walletUnlocked = (unlocked: boolean) => async (dispatch: ((action: checkWalletEncryptionActionType) => void)) => dispatch(walletIsUnlocked(unlocked))
