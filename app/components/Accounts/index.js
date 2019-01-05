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
      const iCopy = {...i}

      // Separating aliases and addresses for later ordering
      // Using of sort method would result in unpredictable result and kinda complex ordering logic
      if (iCopy.alias) {
        
        try {
          if (iCopy.publicValue.length && JSON.parse(iCopy.publicValue).avatarUrl) {
            iCopy.avatarUrl = JSON.parse(iCopy.publicValue).avatarUrl
          }
        } catch(err) {
          iCopy.avatarUrl = ''
        }
        return aliases.push(iCopy)
      }

      iCopy.avatarUrl = ''

      return addresses.push(iCopy)
    })
    
    return aliases.concat(addresses).map((i: Object) => (
      <AliasAddressItem
        key={i.address}
        alias={i.alias}
        address={i.address}
        isLoading={this.props.aliasAssets.isLoading}
        isSelected={this.isAliasSelected(i)}
        updateSelectedAlias={this.props.updateSelectedAlias}
        getPrivateKey={this.props.getPrivateKey}
        hasAvatar={i.hasAvatar}
        avatarUrl={i.avatarUrl}
        claimInterest={this.props.claimInterest}
        t={this.props.t}
      />
    ))
  }

  generateAliasAssets() {
    return this.props.aliasAssets.data.map((i: Object) => (
      <AssetBox
        isSelected={this.props.aliasAssets.selected === i.asset}
        selectAsset={this.props.selectAsset}
        asset={i.asset}
        balance={i.balance}
        symbol={i.symbol}
        key={i.asset}
        goToSendAssetForm={this.goToSendAssetForm.bind(this)}
        selectedAlias={this.props.selectedAlias}
        claimInterest={this.props.claimInterest}
        canClaimInterest={i.interest_rate > 0}
        t={this.props.t}
      />
    ))
  }

  generateTransactionsTable() {
    return (
      <TransactionList
        data={this.props.transactions.data}
        error={this.props.transactions.error}
        isLoading={this.props.transactions.isLoading}
        selectedAlias={this.props.selectedAlias}
        t={this.props.t}
      />
    )
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
          {this.props.aliasAssets.data.length ? (
            <div>
              <Row className='asset-box-container'>
                <h4 className='asset-box-text'>
                  {t('accounts.asset.available_assets')}
                </h4>
                {this.generateAliasAssets()}
              </Row>
            </div>
          ) : null}
          <Row>
            <Col offset={1} xs={21}>
              {this.props.aliasAssets.selected ? (
                <div>
                  <h4 className='transactions-table-title'>{t('accounts.asset.transactions_for', { asset: this.props.aliasAssets.selectedSymbol })}</h4>
                  {this.generateTransactionsTable()}
                </div>
              ) : null}
            </Col>
          </Row>
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
