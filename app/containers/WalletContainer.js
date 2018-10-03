// @flow
import React, { Component  } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'
import Wallet from '../components/Wallet'
import { saveGetInfo, saveAliases } from 'fw-actions/wallet'
import saveGuids from 'fw-actions/options'
import processIncompleteAliases from 'fw-utils/process-incomplete-alias'

import loadCustomCss from 'fw-utils/load-css'
import getPaths from 'fw-utils/get-doc-paths'

type Props = {
  saveGetInfo: Function,
  saveAliases: Function,
  saveGuids: Function
};

class WalletContainer extends Component<Props> {
  props: Props;

  componentWillMount() {
    loadCustomCss(getPaths().customCssPath)
    this.props.saveGuids(window.appStorage.get('guid'))
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
    processIncompleteAliases()
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
  saveGuids
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletContainer)
