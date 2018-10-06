// @flow
import React, { Component  } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import Wallet from 'fw-components/Wallet'
import { saveGetInfo, saveAliases, saveUnfinishedAliases, saveBlockchainInfo } from 'fw-actions/wallet'
import saveGuids from 'fw-actions/options'
import processIncompleteAliases from 'fw-utils/process-incomplete-alias'
import { getAssetAllocationTransactions } from 'fw-sys'

import loadCustomCss from 'fw-utils/load-css'
import getPaths from 'fw-utils/get-doc-paths'

type Props = {
  headBlock: number,
  currentBlock: number,
  unfinishedAliases: Array<Object>,
  aliases: Array<Object>,
  saveGetInfo: Function,
  saveAliases: Function,
  saveGuids: Function,
  saveUnfinishedAliases: Function,
  saveBlockchainInfo: Function
};

class WalletContainer extends Component<Props> {
  props: Props;

  componentWillMount() {
    loadCustomCss(getPaths().customCssPath)
  }

  componentDidMount() {
    if (!window.updateWalletHigh) {
      window.updateWalletHigh = setInterval(() => this.updateWalletHigh(), 10000)
    }
    if (!window.updateWalletLow) {
      window.updateWalletLow = setInterval(() => this.updateWalletLow(), 10000)
    }

    this.updateWalletHigh()
    // Firing low priority queue a few secs later so aliases can get to the store first.
    setTimeout(() => this.updateWalletLow(), 5000)
  }

  updateWalletHigh() {
    this.props.saveGetInfo()
    this.props.saveAliases()
    this.props.saveUnfinishedAliases()
    this.props.saveBlockchainInfo()
    processIncompleteAliases({
      unfinishedAliases: this.props.unfinishedAliases,
      actualBlock: this.props.currentBlock
    })
  }

  updateWalletLow() {
    this.updateAssets()
  }

  async updateAssets() {
    const { aliases } = this.props
    let guids = window.appStorage.get('guid') || []

    guids = guids.filter(i => i !== 'none')

    guids = guids.map(i => i._id) // eslint-disable-line no-underscore-dangle

    if (!guids.length) {
      // Tries to identify owned tokens by looking for asset transactions done by user's addresses/aliases
      try {
        // Gets all asset transactions in the chain
        guids = await getAssetAllocationTransactions()

        guids = guids
          // If address/alias has made any transaction of asset i, then add it to the list of allowed guids.
          .filter(i => aliases.find(x => x.alias === i.sender || x.alias === i.receiver || x.alias === i.sender || x.alias === i.receiver))
          // Only need the guid, discard the rest.
          .map(i => i.asset) 
          // Delete duplicates
        guids = guids.filter((i, ind) => guids.indexOf(i) === ind)
      } catch(err) {
        guids = []
      }
    }

    this.props.saveGuids(guids)
  }

  onMinimize() {
    ipcRenderer.send('minimize')
  }

  onClose() {
    ipcRenderer.send('close')
  }

  syncPercentage() {
    const { currentBlock, headBlock } = this.props

    if (headBlock === 0) {
      return 0
    }

    return parseInt((currentBlock / headBlock) * 100, 10)
  }

  render() {
    return (
      <Wallet
        syncPercentage={this.syncPercentage()}
        currentBlock={this.props.currentBlock}
        headBlock={this.props.headBlock}
        onMinimize={this.onMinimize}
        onClose={this.onClose}
      />
    )
  }
}

const mapStateToProps = state => ({
  unfinishedAliases: state.wallet.unfinishedAliases,
  aliases: state.wallet.aliases,
  headBlock: state.wallet.blockchaininfo.headers,
  currentBlock: state.wallet.getinfo.blocks
})

const mapDispatchToProps = dispatch => bindActionCreators({
  saveGetInfo,
  saveAliases,
  saveGuids,
  saveUnfinishedAliases,
  saveBlockchainInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
