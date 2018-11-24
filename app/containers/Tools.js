// @flow
import React, { Component } from 'react'
import { remote } from 'electron'
import { connect } from 'react-redux'
import Tools from 'fw-components/Tools'

import {
  exportWallet,
  importWallet,
  encryptWallet,
  changePwd
} from 'fw-sys'
import {
  pushNewAlias
} from 'fw-utils/new-alias-manager'
import unlockWallet from 'fw-utils/unlock-wallet'

type Props = {
  currentBlock: number,
  unfinishedAliases: Array<{
    aliasName: string,
    round: number,
    block: number
  }>,
  isEncrypted: boolean
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
      />
    )
  }
}

const mapStateToProps = state => ({
  currentBlock: state.wallet.getinfo.blocks,
  unfinishedAliases: state.wallet.unfinishedAliases,
  isEncrypted: state.wallet.isEncrypted
})

export default connect(mapStateToProps)(ToolsContainer)
