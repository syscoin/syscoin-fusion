// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import swal from 'sweetalert'
import map from 'async/map'
import waterfall from 'async/waterfall'

import Accounts from 'fw-components/Wallet/Accounts/'
import {
  currentBalance,
  getAliases,
  getAssetInfo,
  getAssetAllocationInfo,
  getTransactionsPerAsset
} from 'fw-sys'

type Props = {
  balance: number
};
type State = {
  selectedAlias: string,
  aliasAssets: {
    selected: '',
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  },
  transactions: {
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  },
  aliases: Array<Object>
};

class AccountsContainer extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.initialState = {
      selectedAlias: '',
      aliasAssets: {
        selected: '',
        isLoading: false,
        data: [],
        error: false
      },
      transactions: {
        isLoading: false,
        data: [],
        error: false
      },
      aliases: []
    }

    this.state = {
      ...this.initialState
    }
  }

  componentWillMount() {
    this.updateAccountsTab()
    if (!window.AccountsUpdate) {
      window.AccountsUpdate = setInterval(() => {
        this.updateAccountsTab()
      }, 10000)
    }
  }

  componentWillUnmount() {
    clearInterval(window.AccountsUpdate)
  }

  updateAccountsTab() {
    this.getAliases()
  }

  async getAliases() {
    try {
      this.setState({
        aliases: await getAliases()
      })
    } catch(err) {
      this.setState({
        aliases: []
      })
    }
  }

  updateSelectedAlias(alias: string) {
    if (this.state.aliasAssets.isLoading) {
      return false
    }
    
    this.setState({
      selectedAlias: alias,
      aliasAssets: {
        selected: '',
        isLoading: true,
        data: [],
        error: false
      },
      transactions: {
        isLoading: true,
        data: [],
        error: false
      }
    }, () => {
      this.getAssetsInfo(alias)
    })
  }

  getAssetsInfo(alias: string) {

    waterfall([
      done => {
        // Get GUIDs
        const guids = global.appStorage.get('guid')

        if (guids[0] === 'none') {
          swal('No asset selected', 'Add some in Fusion/fusion.cfg file located in your Documents folder', 'warning')
          return done(true)
        }

        if (!guids.length) {
          return done(true)
        }

        done(null, guids)
      },
      (guids, done) => {
        // Get balance and symbol by using assetallocationinfo
        map(guids, async (i, cb) => {
          let data
          try {
            data = await getAssetAllocationInfo({
              assetId: i,
              aliasName: alias
            })
          } catch(err) {
            if (err.message.indexOf('ERRCODE: 1507')) {
              return cb(null, {
                balance: '0',
                alias,
                asset: i,
                symbol: ''
              })
            }
          }

          cb(null, data)
        }, (err, result) => done(err, result))
      },
      (data, done) => {
        // If alias/address doesnt own any token, fallback to assetinfo.
        if (data.find(i => !i.symbol)) {
          return map(data, async (x, cb) => {
            if (x.symbol.lenght) {
              return cb(null, x)
            }

            let assetInfo

            try {
              assetInfo = await getAssetInfo(x.asset)
            } catch (assetInfoErr) {
              return cb(assetInfoErr)
            }
  
            x.symbol = assetInfo.symbol
            x.balance = '0'
            return cb(null, x)
          }, (error, finalResult) => done(null, finalResult.filter(x => x)))
        }

        return done(null, data)
      }
    ], (err, result) => {
      if (err) {
        this.setState({
          aliasAssets: {
            selected: '',
            data: [],
            isLoading: false,
            error: true
          }
        })
        return swal('Error', 'Something went wrong', 'error')
      }

      this.setState({
        aliasAssets: {
          selected: '',
          data: result,
          isLoading: false,
          error: false
        }
      })
    })
  }

  selectAsset(asset: string) {
    this.setState({
      aliasAssets: {
        ...this.state.aliasAssets,
        selected: asset,
        error: false
      },
      transactions: {
        ...this.initialState.transactions,
        isLoading: true
      }
    }, async () => {

      let transactions

      try {
        transactions = await getTransactionsPerAsset({
          alias: this.state.selectedAlias,
          assetId: asset
        })
      } catch(err) {
        this.setState({
          transactions: {
            data: [],
            isLoading: false,
            error: true
          }
        })
      }
      
      this.setState({
        transactions: {
          isLoading: false,
          data: transactions,
          error: false
        }
      })
    })
  }

  render() {
    const { aliases, transactions, selectedAlias, aliasAssets } = this.state
    const { balance } = this.props

    return (
      <Accounts
        balance={balance}
        aliases={aliases}
        transactions={transactions}
        selectedAlias={selectedAlias}
        aliasAssets={aliasAssets}
        updateSelectedAlias={this.updateSelectedAlias.bind(this)}
        selectAsset={this.selectAsset.bind(this)}
      />
    )
  }
}

const mapStateToProps = state => ({
  balance: state.wallet.getinfo.balance
})

export default connect(mapStateToProps)(AccountsContainer)
