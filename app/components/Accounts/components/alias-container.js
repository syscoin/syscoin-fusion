// @flow
import React, { Component } from 'react'
import SyncLoader from './sync-loader'
import AliasAddressItem from './alias-address-item'

type Props = {
  t: Function,
  aliases: Array<Object>,
  aliasAssets: Object,
  headBlock: number,
  currentBlock: number,
  updateSelectedAlias: Function,
  claimInterest: Function,
  selectedAlias: string,
  getPrivateKey: Function,
  syncPercentage: number
};

export default class AliasContainer extends Component<Props> {

  generateAliasesBoxes() {
    return this.props.aliases.map(i => (
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
        {this.props.syncPercentage !== 100 ? (
          <SyncLoader
            syncPercentage={this.props.syncPercentage}
            headBlock={this.props.headBlock}
            currentBlock={this.props.currentBlock}
            t={t}
          />
        ) : null}
        <div className='aliases-container'>
          {this.generateAliasesBoxes()}
        </div>
      </div>
    )
  }
}
