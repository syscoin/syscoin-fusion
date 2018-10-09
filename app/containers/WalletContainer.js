// @flow
import React, { Component  } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import Wallet from 'fw-components/Wallet'
import { saveGetInfo, saveAliases, saveUnfinishedAliases, saveBlockchainInfo } from 'fw-actions/wallet'
import { saveGuids, toggleMaximize } from 'fw-actions/options'
import processIncompleteAliases from 'fw-utils/process-incomplete-alias'
import { getAssetAllocationTransactions } from 'fw-sys'

import loadCustomCss from 'fw-utils/load-css'
import getPaths from 'fw-utils/get-doc-paths'

type Props = {
  isMaximized: boolean,
  unfinishedAliases: Array<Object>,
  aliases: Array<Object>,
  saveGetInfo: Function,
  saveAliases: Function,
  saveGuids: Function,
  saveUnfinishedAliases: Function,
  saveBlockchainInfo: Function,
  toggleMaximize: Function
};

class WalletContainer extends Component<Props> {
  props: Props;

  componentWillMount() {
    loadCustomCss(getPaths().customCssPath)
  }

  componentDidMount() {
    window.max = this.onMaximize

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

  onMaximize() {
    this.props.toggleMaximize()
    ipcRenderer.send('maximize')
  }
  
  onUnmaximize() {
    this.props.toggleMaximize()
    ipcRenderer.send('unmaximize')
  }

  render() {
    return (
      <Wallet
        isMaximized={this.props.isMaximized}
        onMinimize={this.onMinimize}
        onClose={this.onClose}
        onMaximize={this.onMaximize}
        onUnmaximize={this.onUnmaximize}
      />
    )
  }
}

const mapStateToProps = state => ({
  unfinishedAliases: state.wallet.unfinishedAliases,
  aliases: state.wallet.aliases,
  headBlock: state.wallet.blockchaininfo.headers,
  currentBlock: state.wallet.getinfo.blocks,
  isMaximized: state.options.isMaximized
})

const mapDispatchToProps = dispatch => bindActionCreators({
  saveGetInfo,
  saveAliases,
  saveGuids,
  saveUnfinishedAliases,
  saveBlockchainInfo,
  toggleMaximize
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
