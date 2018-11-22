// @flow
import React, { Component } from 'react'
import { remote } from 'electron'
import { connect } from 'react-redux'
import Tools from 'fw-components/Tools'

import {
  exportWallet,
  importWallet,
  encryptWallet
} from 'fw-sys'
import {
  pushNewAlias
} from 'fw-utils/new-alias-manager'

type Props = {
  currentBlock: number,
  unfinishedAliases: Array<{
    aliasName: string,
    round: number,
    block: number
  }>
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
      />
    )
  }
}

const mapStateToProps = state => ({
  currentBlock: state.wallet.getinfo.blocks,
  unfinishedAliases: state.wallet.unfinishedAliases
})

export default connect(mapStateToProps)(ToolsContainer)
