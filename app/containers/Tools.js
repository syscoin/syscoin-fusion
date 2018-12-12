// @flow
import React, { Component } from 'react'
import { remote } from 'electron'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Tools from 'fw-components/Tools'

import {
  exportWallet,
  importWallet,
  encryptWallet,
  changePwd,
  lockWallet
} from 'fw-sys'
import {
  pushNewAlias
} from 'fw-utils/new-alias-manager'
import unlockWallet from 'fw-utils/unlock-wallet'
import { walletUnlocked } from 'fw-actions/wallet'

const { dialog } = remote.require('electron')

type Props = {
  currentBlock: number,
  unfinishedAliases: Array<{
    aliasName: string,
    round: number,
    block: number
  }>,
  isEncrypted: boolean,
  isUnlocked: boolean,
  walletUnlocked: Function
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
    try {
      await encryptWallet(pass)
    } catch(err) {
      return false
    }

    remote.app.relaunch()
    remote.app.exit()

    return true
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

  render() {
    return (
      <Tools
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
      />
    )
  }
}

const mapStateToProps = state => ({
  currentBlock: state.wallet.getinfo.blocks,
  unfinishedAliases: state.wallet.unfinishedAliases,
  isEncrypted: state.wallet.isEncrypted,
  isUnlocked: state.wallet.isUnlocked
})

const mapDispatchToProps = dispatch => bindActionCreators({
  walletUnlocked
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ToolsContainer)
