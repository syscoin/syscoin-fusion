// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin } from 'antd'
import AliasAddressItem from './components/alias-address-item'
import AssetBox from './components/asset-box'
import TransactionList from './components/transaction-list'
import UserBalance from './components/balance'
import SyncLoader from './components/sync-loader'
import Home from './components/home'
import Dashboard from './components/dashboard'
import AssetDetails from './components/asset-details'

type Props = {
  backgroundLogo: string,
  balance: number,
  aliases: Array<Object>,
  transactions: Object,
  selectedAlias: string,
  aliasAssets: {
    selected: string,
    selectedSymbol: string,
    isLoading: boolean,
    data: Array<any>,
    error: boolean
  },
  updateSelectedAlias: Function,
  selectAsset: Function,
  headBlock: number,
  currentBlock: number,
  syncPercentage: number,
  getAliasInfo: Function,
  getPrivateKey: Function,
  goToHome: Function,
  dashboardSysTransactions: {
    isLoading: boolean,
    error: boolean,
    data: Array<Object>
  },
  dashboardAssets: {
    isLoading: boolean,
    error: boolean,
    data: Array<Object>
  },
  getDashboardAssets: Function,
  getDashboardTransactions: Function,
  goToAssetForm: Function,
  goToSysForm: Function,
  claimInterest: Function,
  claimAllInterestFromAsset: Function,
  t: Function
};

export default class Accounts extends Component<Props> {
  props: Props;

  isAliasSelected(aliasInfo: Object) {
    return aliasInfo.alias ? aliasInfo.alias === this.props.selectedAlias : aliasInfo.address === this.props.selectedAlias
  }

  generateAliasesBoxes() {
    const aliases = []
    const addresses = []

    this.props.aliases.forEach(i => {
      if (i.alias) {
        return aliases.push(i)
      }

      addresses.push(i)
    })
    
    return aliases.concat(addresses).map(i => (
      <AliasAddressItem
        key={i.address}
        alias={i.alias}
        address={i.address}
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

  refreshDashboardAssets() {
    this.props.getDashboardAssets()
  }

  refreshDashboardTransactions() {
    this.props.getDashboardTransactions()
  }

  goToSendAssetForm(asset: string) {
    this.props.goToAssetForm(asset, this.props.selectedAlias)
  }

  render() {
    const { t } = this.props
    return (
      <Row className='accounts-container'>
        <Col xs={9} className='accounts-container-left'>
          <Home
            onClick={this.props.goToHome}
            className='home-btn'
            disabled={this.props.transactions.isLoading || this.props.aliasAssets.isLoading}
          />
          <UserBalance
            currentBalance={this.props.balance}
            t={t}
          />
          <hr className='alias-separator' />
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
        </Col>
        <Col xs={15} className='accounts-container-right'>
          {(!this.props.selectedAlias || this.props.aliasAssets.error) ? (
            <Dashboard
              balance={this.props.balance}
              backgroundLogo={this.props.backgroundLogo}
              transactions={this.props.dashboardSysTransactions}
              assets={this.props.dashboardAssets}
              refreshDashboardAssets={this.refreshDashboardAssets.bind(this)}
              refreshDashboardTransactions={this.refreshDashboardTransactions.bind(this)}
              goToSysForm={this.props.goToSysForm}
              claimAllInterestFromAsset={this.props.claimAllInterestFromAsset}
              t={t}
            />
          ) : null}
          <AssetDetails
            t={t}
            aliasAssets={this.props.aliasAssets}
            selectAsset={this.props.selectAsset}
            goToSendAssetForm={this.goToSendAssetForm.bind(this)}
            selectedAlias={this.props.selectedAlias}
            claimInterest={this.props.claimInterest}
            transactions={this.props.transactions}
          />
          {this.props.aliasAssets.isLoading &&
            <div className='loading-container'>
              <Spin indicator={<Icon type='loading' spin />} />
            </div>
          }
        </Col>
      </Row>
    )
  }
}
