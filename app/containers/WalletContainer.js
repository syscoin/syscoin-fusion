// @flow
import React, { Component  } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { ipcRenderer, remote } from 'electron'
import Wallet from 'fw-components/Wallet'
import {
  saveGetInfo,
  saveAliases,
  saveUnfinishedAliases,
  saveBlockchainInfo,
  dashboardTransactions,
  checkWalletEncryption,
  getWalletBalance,
} from 'fw-actions/wallet'
import { saveGuids, toggleMaximize } from 'fw-actions/options'
import processIncompleteAliases from 'fw-utils/process-incomplete-alias'
import replaceColorPalette from 'fw-utils/replace-color-palette'
import { getAssetInfo, getAssets } from 'fw-sys'

import loadCustomCss from 'fw-utils/load-css'
import getPaths from 'fw-utils/get-doc-paths'
import closeSysd from 'fw-utils/close-sysd'

type Props = {
  isMaximized: boolean,
  unfinishedAliases: Array<Object>,
  currentBlock: number,
  saveGetInfo: Function,
  saveAliases: Function,
  saveGuids: Function,
  saveUnfinishedAliases: Function,
  saveBlockchainInfo: Function,
  toggleMaximize: Function,
  dashboardTransactions: Function,
  checkWalletEncryption: Function,
  t: Function
};

class WalletContainer extends Component<Props> {
  props: Props;

  componentWillMount() {
    loadCustomCss(getPaths().customCssPath)

    ipcRenderer.on('maximize', () => {
      this.props.toggleMaximize(true)
    })
    ipcRenderer.on('unmaximize', () => {
      this.props.toggleMaximize(false)
    })

    this.props.toggleMaximize(remote.getCurrentWindow().isMaximized())
    replaceColorPalette()
  }

  componentDidMount() {
    window.max = this.onMaximize

    if (!window.updateWalletHigh) {
      window.updateWalletHigh = setInterval(() => this.updateWalletHigh(), 5000)
    }

    if (!window.updateWalletLow) {
      window.updateWalletLow = setInterval(() => this.updateWalletLow(), 60000)
    }
    
    this.updateWalletHigh()
    this.updateWalletLow()
    // Update guids in store
    this.updateAssets()

    // Get Dashboard data
    this.props.dashboardTransactions(0, 10)
  }

  updateWalletLow() {
    this.props.saveAliases()
  }

  updateWalletHigh() {
    this.props.saveGetInfo()
    this.props.saveUnfinishedAliases()
    this.props.saveBlockchainInfo()
    this.props.checkWalletEncryption()
    this.props.getWalletBalance()
    processIncompleteAliases({
      unfinishedAliases: this.props.unfinishedAliases,
      actualBlock: this.props.currentBlock
    })
  }

  async updateAssets() {
    let guids = window.appStorage.get('guid') || []

    guids = guids.filter(i => i !== 'none')

    guids = guids.map(i => getAssetInfo(i))

    try {
      guids = await Promise.all(guids)
    } catch(err) {
      guids = []
    }
    this.props.saveGuids(guids)
  }

  onMinimize() {
    ipcRenderer.send('minimize')
  }

  onClose() {
    closeSysd()
    setTimeout(() => {
      ipcRenderer.send('close')
    }, 500)
  }

  onMaximize() {
    ipcRenderer.send('maximize')
  }
  
  onUnmaximize() {
    ipcRenderer.send('unmaximize')
  }

  render() {
    return (
      <Wallet
        isMaximized={this.props.isMaximized}
        onMinimize={this.onMinimize}
        onClose={this.onClose}
        onMaximize={this.onMaximize.bind(this)}
        onUnmaximize={this.onUnmaximize.bind(this)}
        t={this.props.t}
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
  toggleMaximize,
  dashboardTransactions,
  checkWalletEncryption,
  getWalletBalance
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translation')(WalletContainer))
