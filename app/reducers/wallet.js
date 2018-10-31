// @flow
import {
  WALLET_GETINFO,
  WALLET_ALIASES,
  WALLET_UNFINISHED_ALIASES,
  WALLET_BLOCKCHAIN_INFO,
  WALLET_DASHBOARD_ASSETS,
  WALLET_DASHBOARD_TRANSACTIONS_IS_LOADING,
  WALLET_DASHBOARD_TRANSACTIONS_ERROR,
  WALLET_DASHBOARD_TRANSACTIONS_RECEIVE
} from 'fw-types/wallet'

type actionType = {
  +type: string,
  payload ?: any
};

export const initialState = {
  getinfo: {
    version: "",
    dashversion: "",
    protocolversion: 0,
    walletversion: 0,
    balance: 0,
    privatesend_balance: 0,
    blocks: 0,
    timeoffset: 0,
    connections: 0,
    proxy: "",
    difficulty: 0,
    testnet: false,
    keypoololdest: 0,
    keypoolsize: 0,
    paytxfee: 0,
    relayfee: 0,
    errors: ""
  },
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
      errorMessage: '',
      data: []
    }
  }
}

export default function wallet(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case WALLET_GETINFO:
      return {
        ...state,
        getinfo: action.payload
      }
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
    case WALLET_DASHBOARD_ASSETS:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          assets: action.payload
        }
      }
    case WALLET_DASHBOARD_TRANSACTIONS_IS_LOADING:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          transactions: {
            isLoading: true,
            error: false,
            errorMessage: '',
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
            errorMessage: action.payload,
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
            errorMessage: '',
            data: action.payload
          }
        }
      }
    default:
      return state
  }
}
