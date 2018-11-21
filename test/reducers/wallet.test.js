import reducer, { initialState } from 'fw-reducers/wallet'
import * as types from 'fw-types/wallet'

describe('Wallet reducer', () => {
  it('should return initial state', () => {
    const action = {}
    expect(reducer(initialState, action)).toEqual({ ...initialState })
  })

  it('should handle WALLET_GETINFO', () => {
    const action = {
      type: types.WALLET_GETINFO,
      payload: {
        version: "2",
        dashversion: "2",
        protocolversion: 2,
        walletversion: 2,
        balance: 2,
        privatesend_balance: 2,
        blocks: 2,
        timeoffset: 2,
        connections: 2,
        proxy: "2",
        difficulty: 2,
        testnet: false,
        keypoololdest: 2,
        keypoolsize: 2,
        paytxfee: 2,
        relayfee: 2,
        errors: "2"
      }
    }
    const expectedState = {
      ...initialState,
      getinfo: action.payload
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_ALIASES', () => {
    const action = {
      type: types.WALLET_ALIASES,
      payload: [{
        address: 'TAJuQX4fzGZHCEW3w98GjsRBjkVXcMNwk7',
        balance: 0,
        label: '',
        alias: '',
        change: false
      }]
    }
    const expectedState = {
      ...initialState,
      aliases: action.payload
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_UNFINISHED_ALIASES', () => {
    const action = {
      type: types.WALLET_UNFINISHED_ALIASES,
      payload: [{
        aliasName: 'test_alias',
        publicValue: '',
        acceptTransferFlags: 3,
        expireTimestamp: '1548184538',
        address: '',
        encryptionPrivKey: '',
        encryptionPublicKey: '',
        witness: '',
        block: 223,
        round: 0,
        error: null
      }]
    }
    const expectedState = {
      ...initialState,
      unfinishedAliases: action.payload
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_BLOCKCHAIN_INFO', () => {
    const action = {
      type: types.WALLET_BLOCKCHAIN_INFO,
      payload: {
        chain: 'regtest',
        blocks: 223,
        headers: 223,
        bestblockhash: 'af2693ee60018544fecaa137c50af70cd8dff774c02beeee399b16c91f584b6a',
        difficulty: 4.656542373906925e-10,
        mediantime: 1541826274,
        verificationprogress: 1,
        chainwork: '00000000000000000000000000000000000000000000000000000000000001c0',
        pruned: false,
        softforks: [
          {
            id: 'bip34',
            version: 2,
            reject: {
              status: true
            }
          },
          {
            id: 'bip66',
            version: 3,
            reject: {
              status: false
            }
          },
          {
            id: 'bip65',
            version: 4,
            reject: {
              status: false
            }
          }
        ],
        bip9_softforks: {
          csv: {
            status: 'started',
            bit: 0,
            startTime: 0,
            timeout: 999999999999,
            since: 144
          },
          dip0001: {
            status: 'started',
            bit: 1,
            startTime: 0,
            timeout: 999999999999,
            since: 144
          },
          bip147: {
            status: 'started',
            bit: 2,
            startTime: 0,
            timeout: 999999999999,
            since: 144
          }
        }
      }
    }
    const expectedState = {
      ...initialState,
      blockchaininfo: action.payload
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_DASHBOARD_TRANSACTIONS_IS_LOADING', () => {
    const action = {
      type: types.WALLET_DASHBOARD_TRANSACTIONS_IS_LOADING
    }
    const expectedState = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        transactions: {
          isLoading: true,
          error: false,
          data: []
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_DASHBOARD_TRANSACTIONS_ERROR', () => {
    const action = {
      type: types.WALLET_DASHBOARD_TRANSACTIONS_ERROR
    }
    const expectedState = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        transactions: {
          isLoading: false,
          error: true,
          data: []
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_DASHBOARD_TRANSACTIONS_RECEIVE', () => {
    const action = {
      type: types.WALLET_DASHBOARD_TRANSACTIONS_RECEIVE,
      payload: [{
        account: '',
        address: 'TJBsAiQcYV2MopDKhDhywqbDtGrER84jXn',
        category: 'orphan',
        amount: 32.9175,
        vout: 0,
        confirmations: 0,
        instantlock: false,
        generated: true,
        trusted: false,
        txid: '8f1b9047c3844971a534bcfa4b286b38be6c14e0c1b7417e900a25c85c98e65b',
        walletconflicts: [],
        time: 1542046247000,
        timereceived: 1542046247,
        'bip125-replaceable': 'unknown'
      }]
    }
    const expectedState = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        transactions: {
          isLoading: false,
          error: false,
          data: action.payload
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_DASHBOARD_ASSETS_IS_LOADING', () => {
    const action = {
      type: types.WALLET_DASHBOARD_ASSETS_IS_LOADING
    }
    const expectedState = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        assets: {
          isLoading: true,
          error: false,
          data: []
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_DASHBOARD_ASSETS_ERROR', () => {
    const action = {
      type: types.WALLET_DASHBOARD_ASSETS_ERROR
    }
    const expectedState = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        assets: {
          isLoading: false,
          error: true,
          data: []
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_DASHBOARD_ASSETS_RECEIVE', () => {
    const action = {
      type: types.WALLET_DASHBOARD_ASSETS_RECEIVE,
      payload: [{
        balance: 100,
        asset: '0c9df9a04d306e02',
        symbol: 'PEPITA'
      }]
    }
    const expectedState = {
      ...initialState,
      dashboard: {
        ...initialState.dashboard,
        assets: {
          isLoading: false,
          error: false,
          data: action.payload
        }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle WALLET_IS_ENCRYPTED', () => {
    const action = {
      type: types.WALLET_IS_ENCRYPTED,
      payload: true
    }
    const expectedState = {
      ...initialState,
      isEncrypted: true
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
