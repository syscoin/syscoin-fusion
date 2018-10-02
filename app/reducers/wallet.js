// @flow
import { WALLET_GETINFO } from 'fw-types/wallet'


type StateType = {
  getinfo: {
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

type actionType = {
  +type: string,
  +payload: getInfoType
};

const initialState = {
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
  }
}

export default function wallet(state: StateType = initialState, action: actionType) {
  switch (action.type) {
    case WALLET_GETINFO:
      return {
        ...state,
        getinfo: action.payload
      }
    default:
      return state
  }
}
