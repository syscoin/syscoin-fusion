// @flow
import React, { Component } from 'react'
import AliasAddressItem from './alias-address-item'
import AliasActions from './alias-actions'

type Props = {
  t: Function,
  aliases: Array<Object>,
  aliasAssets: Object,
  headBlock: number,
  currentBlock: number,
  updateSelectedAlias: Function,
  getNewAddress: Function,
  claimInterest: Function,
  selectedAlias: string,
  getPrivateKey: Function,
  syncPercentage: number
};

export default class AliasContainer extends Component<Props> {

  generateAliasesBoxes() {
    const withLabel = this.props.aliases.filter(i => i.label.length)
    const withoutLabel = this.props.aliases.filter(i => !i.label.length)

    return withLabel.concat(withoutLabel).map(i => (
      <AliasAddressItem
        key={i.address}
        alias={i.alias || ''}
        address={i.address}
        label={i.label}
        isLoading={this.props.aliasAssets.isLoading}
        isSelected={this.isAliasSelected(i)}
        updateSelectedAlias={this.props.updateSelectedAlias}
        getPrivateKey={this.props.getPrivateKey}
        hasAvatar={i.hasAvatar}
        avatarUrl={i.avatarUrl || ''}
        claimInterest={this.props.claimInterest}
        t={this.props.t}
      />
    ))
  }

  isAliasSelected(aliasInfo: Object) {
    return aliasInfo.address === this.props.selectedAlias
  }

  render() {
    const { t } = this.props
    return (
      <div className='full-height'>
        <h4 className='your-aliases-text'>{t('accounts.panel.your_aliases')}</h4>
        <AliasActions
          syncPercentage={this.props.syncPercentage}
          headBlock={this.props.headBlock}
          isSynced={this.props.syncPercentage === 100}
          currentBlock={this.props.currentBlock}
          getNewAddress={this.props.getNewAddress}
          t={t}
        />
        <div className='aliases-container'>
          {this.generateAliasesBoxes()}
        </div>
      </div>
    )
  }
}
