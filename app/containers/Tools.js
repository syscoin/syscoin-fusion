// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tools from 'fw-components/Tools'

import {
  exportWallet,
  getPrivateKey,
  importWallet
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

  async getPrivateKey(cb) {
    try {
      await getPrivateKey()
    } catch (err) {
      return cb(err)
    }

    cb()
  }

  createNewAlias(obj: Object, cb: Function) {
    pushNewAlias(obj)
    cb()
  }

  render() {
    return (
      <Tools
        currentBlock={this.props.currentBlock}
        unfinishedAliases={this.props.unfinishedAliases}
        createNewAlias={this.createNewAlias}
        getPrivateKey={this.getPrivateKey}
        importWallet={this.importWallet}
        exportWallet={this.exportWallet}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentBlock: state.wallet.getinfo.blocks,
  unfinishedAliases: state.wallet.unfinishedAliases
})

export default connect(mapStateToProps)(ToolsContainer)
