// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import swal from 'sweetalert'
import map from 'async/map'
import waterfall from 'async/waterfall'

import Accounts from 'fw-components/Accounts/'
import {
  getAssetInfo,
  getAssetAllocationInfo,
  getTransactionsPerAsset
} from 'fw-sys'
import SyscoinLogo from 'fw/syscoin-logo.png'

type Props = {
  balance: number,
  aliases: Array<Object>,
  assets: Array<string>,
  headBlock: number,
  currentBlock: number
};
type State = {
  selectedAlias: string,
  aliasAssets: {
    selected: string,
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  },
  transactions: {
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  }
};

class AccountsContainer extends Component<Props, State> {
  initialState: State

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
        const guids = this.props.assets

        if (!guids.length) {
          this.setState({
            aliasAssets: {
              selected: '',
              data: [],
              isLoading: false,
              error: true
            }
          })
          swal('No asset detected', 'The wallet hasn\'t detected any asset yet. This might happen by not being fully synchronized. You can also add some specific assets in your fusion.cfg file located in Documents/Fusion folder', 'warning')
          return
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
            return cb(true)
          }

          console.log(data)

          cb(null, data)
        }, (err, result) => done(err, result))
      },
      (data, done) => {
        // If alias/address doesnt own any token, fallback to assetinfo.
        if (data.find(i => !i.symbol)) {
          console.log('mariko ke', i.balance, i.symbol, alias)
          return map(data, async (x, cb) => {
            const xObj = {...x}
            if (xObj.symbol.lenght) {
              return cb(null, xObj)
            }

            let assetInfo

            try {
              assetInfo = await getAssetInfo(xObj.asset)
            } catch (assetInfoErr) {
              return cb(assetInfoErr)
            }
  
            xObj.symbol = assetInfo.symbol
            xObj.balance = '0'
            return cb(null, xObj)
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

  syncPercentage() {
    const { currentBlock, headBlock } = this.props

    if (headBlock === 0) {
      return 0
    }

    return parseInt((currentBlock / headBlock) * 100, 10)
  }

  getBackgroundLogo() {
    const bgLogo = global.appStorage.get('background_logo')

    if (bgLogo) {
      return bgLogo
    }

    return SyscoinLogo
  }

  render() {
    const { transactions, selectedAlias, aliasAssets } = this.state
    const { balance, aliases } = this.props

    return (
      <Accounts
        backgroundLogo={this.getBackgroundLogo()}
        syncPercentage={this.syncPercentage()}
        headBlock={this.props.headBlock}
        currentBlock={this.props.currentBlock}
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
  balance: state.wallet.getinfo.balance,
  aliases: state.wallet.aliases,
  assets: state.options.guids,
  headBlock: state.wallet.blockchaininfo.headers,
  currentBlock: state.wallet.getinfo.blocks
})

export default connect(mapStateToProps)(AccountsContainer)
