// @flow
import React, { Component } from 'react'
import { remote, ipcRenderer } from 'electron'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Tools from 'fw-components/Tools'
import { withNamespaces } from 'react-i18next'

import {
  exportWallet,
  importWallet,
  encryptWallet,
  changePwd,
  lockWallet
} from 'fw-sys'
import {
  changeFormTab
} from 'fw-actions/forms'
import {
  pushNewAlias
} from 'fw-utils/new-alias-manager'
import unlockWallet from 'fw-utils/unlock-wallet'
import { walletUnlocked } from 'fw-actions/wallet'
import { changeLanguage } from 'fw-actions/options'

const { dialog } = remote.require('electron')

type Props = {
  activeTab: string,
  changeFormTab: Function,
  currentBlock: number,
  unfinishedAliases: Array<{
    aliasName: string,
    round: number,
    block: number
  }>,
  isEncrypted: boolean,
  isUnlocked: boolean,
  walletUnlocked: Function,
  changeLanguage: Function,
  currentLanguage: string,
  t: Function
};

class ToolsContainer extends Component<Props> {
  props: Props;

  async exportWallet(dir, cb) {
    try {
      await exportWallet(dir)
    } catch (err) {
      return cb(err)
    }

    cb()
  }

  async importWallet(dir, cb) {
    try {
      await importWallet(dir)
    } catch (err) {
      return cb(err)
    }

    cb()
  }

  createNewAlias(obj: Object, cb: Function) {
    pushNewAlias(obj)
    cb()
  }

  async encryptWallet(pass: string) {
    return encryptWallet(pass)
  }

  async lockWallet() {
    await lockWallet()
    this.props.walletUnlocked(false)
  }

  getFolder(cb: Function) {
    return dialog.showOpenDialog({
      properties: ['openDirectory']
    }, path => {
      cb(path)
    })
  }

  toggleConsole() {
    ipcRenderer.send('toggle-console')
  }

  render() {
    return (
      <Tools
        activeTab={this.props.activeTab}
        changeFormTab={this.props.changeFormTab}
        currentBlock={this.props.currentBlock}
        unfinishedAliases={this.props.unfinishedAliases}
        createNewAlias={this.createNewAlias}
        importWallet={this.importWallet}
        exportWallet={this.exportWallet}
        encryptWallet={this.encryptWallet}
        isEncrypted={this.props.isEncrypted}
        changePwd={changePwd}
        unlockWallet={unlockWallet}
        isUnlocked={this.props.isUnlocked}
        lockWallet={this.lockWallet.bind(this)}
        getFolder={this.getFolder}
        toggleConsole={this.toggleConsole}
        changeLanguage={this.props.changeLanguage}
        currentLanguage={this.props.currentLanguage}
        t={this.props.t}
      />
    )
  }
}

const mapStateToProps = state => ({
  activeTab: state.forms.toolsTab.activeTab,
  currentBlock: state.wallet.blockchaininfo.blocks,
  unfinishedAliases: state.wallet.unfinishedAliases,
  isEncrypted: state.wallet.isEncrypted,
  isUnlocked: state.wallet.isUnlocked,
  currentLanguage: state.options.language
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeFormTab,
  walletUnlocked,
  changeLanguage
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translation')(ToolsContainer))
