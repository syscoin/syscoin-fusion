// @flow
import {
  WALLET_ALIASES,
  WALLET_UNFINISHED_ALIASES,
  WALLET_BLOCKCHAIN_INFO,
  WALLET_DASHBOARD_ASSETS_IS_LOADING,
  WALLET_DASHBOARD_ASSETS_ERROR,
  WALLET_DASHBOARD_ASSETS_RECEIVE,
  WALLET_DASHBOARD_TRANSACTIONS_IS_LOADING,
  WALLET_DASHBOARD_TRANSACTIONS_ERROR,
  WALLET_DASHBOARD_TRANSACTIONS_RECEIVE,
  WALLET_IS_ENCRYPTED,
  WALLET_IS_UNLOCKED,
  WALLET_BALANCE,
} from 'fw-types/wallet'

type actionType = {
  +type: string,
  payload ?: any
};

export const initialState = {
  balance: 0,
  aliases: [],
  unfinishedAliases: [],
  blockchaininfo: {
    chain: '',
    blocks: 0,
    headers: 0,
    bestblockhash: '',
    difficulty: 0,
    mediantime: 0,
    verificationprogress: 0,
    chainwork: '',
    pruned: false,
    softforks: [],
    bip9_softforks: {}
  },
  dashboard: {
    assets: {
      isLoading: false,
      error: false,
      data: []
    },
    transactions: {
      isLoading: false,
      error: false,
      data: []
    }
  },
  isEncrypted: false,
  isUnlocked: false
}

export default function wallet(state: Object = initialState, action: actionType) {
  switch (action.type) {
    case WALLET_ALIASES:
      return {
        ...state,
        aliases: action.payload
      }
    case WALLET_UNFINISHED_ALIASES:
      return {
        ...state,
        unfinishedAliases: action.payload
      }
    case WALLET_BLOCKCHAIN_INFO:
      return {
        ...state,
        blockchaininfo: action.payload
      }
    case WALLET_DASHBOARD_TRANSACTIONS_IS_LOADING:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          transactions: {
            isLoading: true,
            error: false,
            data: []
          }
        }
      }
    case WALLET_DASHBOARD_TRANSACTIONS_ERROR:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          transactions: {
            isLoading: false,
            error: true,
            data: []
          }
        }
      }
    case WALLET_DASHBOARD_TRANSACTIONS_RECEIVE:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          transactions: {
            isLoading: false,
            error: false,
            data: action.payload
          }
        }
      }
    case WALLET_DASHBOARD_ASSETS_IS_LOADING:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          assets: {
            isLoading: true,
            error: false,
            data: []
          }
        }
      }
    case WALLET_DASHBOARD_ASSETS_ERROR:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          assets: {
            isLoading: false,
            error: true,
            data: []
          }
        }
      }
    case WALLET_DASHBOARD_ASSETS_RECEIVE:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          assets: {
            isLoading: false,
            error: false,
            data: action.payload
          }
        }
      }
    case WALLET_IS_ENCRYPTED:
      return {
        ...state,
        isEncrypted: action.payload
      }
    case WALLET_IS_UNLOCKED:
      return {
        ...state,
        isUnlocked: action.payload
      }
    case WALLET_BALANCE:
      return {
        ...state,
        balance: action.payload
      }
    default:
      return state
  }
}
