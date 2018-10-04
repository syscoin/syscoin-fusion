// @flow
import React, { Component  } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import Wallet from 'fw-components/Wallet'
import { saveGetInfo, saveAliases, saveUnfinishedAliases } from 'fw-actions/wallet'
import saveGuids from 'fw-actions/options'
import processIncompleteAliases from 'fw-utils/process-incomplete-alias'
import { listAssets } from 'fw-sys'

import loadCustomCss from 'fw-utils/load-css'
import getPaths from 'fw-utils/get-doc-paths'

type Props = {
  saveGetInfo: Function,
  saveAliases: Function,
  saveGuids: Function,
  saveUnfinishedAliases: Function,
  wallet: Object
};

class WalletContainer extends Component<Props> {
  props: Props;

  async componentWillMount() {
    let guids = window.appStorage.get('guid') || []

    guids = guids.filter(i => i !== 'none')

    if (!guids.length) {
      guids = await listAssets()
      guids = guids.map(i => i._id) // eslint-disable-line no-underscore-dangle
    }

    loadCustomCss(getPaths().customCssPath)
    this.props.saveGuids(guids)
  }

  componentDidMount() {
    if (!window.updateWallet) {
      window.updateWallet = setInterval(() => this.updateWallet(), 10000)
    }

    this.updateWallet()
  }

  updateWallet() {
    this.props.saveGetInfo()
    this.props.saveAliases()
    this.props.saveUnfinishedAliases()
    processIncompleteAliases({
      unfinishedAliases: this.props.wallet.unfinishedAliases,
      actualBlock: this.props.wallet.getinfo.blocks
    })
  }

  onMinimize() {
    ipcRenderer.send('minimize')
  }

  onClose() {
    ipcRenderer.send('close')
  }

  render() {
    return (
      <Wallet onMinimize={this.onMinimize} onClose={this.onClose} />
    )
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet
})

const mapDispatchToProps = dispatch => bindActionCreators({
  saveGetInfo,
  saveAliases,
  saveGuids,
  saveUnfinishedAliases
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
