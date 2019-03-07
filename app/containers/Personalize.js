// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import Personalize from 'fw-components/Personalize'
import { aliasInfo, editAlias } from 'fw-sys'

type Props = {
  aliases: Array<Object>
};

type editAliasType = {
  aliasName: string,
  publicValue: string,
  address: string,
  acceptTransfersFlag: number,
  expireTimestamp: string,
  encPrivKey: string,
  encPubKey: string,
  witness: string,
  t: Function
};

class PersonalizeContainer extends Component<Props> {
  props: Props;

  async aliasInfo(aliasName) {
    try {
      return await aliasInfo(aliasName)
    } catch (err) {
      return err
    }
  }

  async editAlias(obj: editAliasType) {
    try {
      return await editAlias(obj)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  render() {
    return (
      <Personalize
        aliasInfo={this.aliasInfo}
        currentAliases={this.props.aliases}
        editAlias={this.editAlias}
      />
    )
  }
}

const mapStateToProps = state => ({
  aliases: state.wallet.aliases
})

export default connect(mapStateToProps, mapDispatchToProps)(withNamespaces('translation')(PersonalizeContainer))
