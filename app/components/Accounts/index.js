import React, { Component } from 'react'
import { Row, Col, Icon, Spin } from 'antd'
import AliasAddressItem from './components/alias-address-item'
import AssetBox from './components/asset-box'
import TransactionList from './components/transaction-list'
import UserBalance from './components/balance'
import SyncLoader from './components/sync-loader'

type Props = {
  backgroundLogo: string,
  balance: number,
  aliases: Array<Object>,
  transactions: Object,
  selectedAlias: string,
  aliasAssets: Object,
  updateSelectedAlias: Function,
  selectAsset: Function,
  headBlock: number,
  currentBlock: number,
  syncPercentage: number
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
      // Separating aliases and addresses for later ordering
      // Using of sort method would result in unpredictable result and kinda complex ordering logic
      if (i.alias) {
        return aliases.push(i)
      }

      return addresses.push(i)
    })
    
    return aliases.concat(addresses).map((i) => (
      <AliasAddressItem
        key={i.address}
        alias={i.alias}
        address={i.address}
        isLoading={this.props.aliasAssets.isLoading}
        isSelected={this.isAliasSelected(i)}
        updateSelectedAlias={this.props.updateSelectedAlias}
      />
    ))
  }

  generateAliasAssets() {
    return this.props.aliasAssets.data.map(i => (
      <AssetBox
        isSelected={this.props.aliasAssets.selected === i.asset}
        selectAsset={this.props.selectAsset}
        asset={i.asset}
        balance={i.balance}
        symbol={i.symbol}
        key={i.asset}
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
      />
    )
  }

  render() {
    return (
      <Row className='accounts-container'>
        <Col xs={9} className='accounts-container-left'>
          <UserBalance
            currentBalance={this.props.balance}
          />
          <hr className='alias-separator' />
          <h4 className='your-aliases-text'>Your aliases/addresses</h4>
          {this.props.syncPercentage !== 100 ? (
            <SyncLoader
              syncPercentage={this.props.syncPercentage}
              headBlock={this.props.headBlock}
              currentBlock={this.props.currentBlock}
            />
          ) : null}
          <div className='aliases-container'>
            {this.generateAliasesBoxes()}
          </div>
        </Col>
        <Col xs={15} className='accounts-container-right'>
          {(!this.props.selectedAlias || this.props.aliasAssets.error) ? <img src={this.props.backgroundLogo} alt='sys-logo' className='sys-logo-bg' /> : null}
          {this.props.aliasAssets.data.length ? (
            <div>
              <Row className='asset-box-container'>
                <h4 className='asset-box-text'>Available assets</h4>
                {this.generateAliasAssets()}
              </Row>
            </div>
          ) : null}
          <Row>
            <Col offset={1} xs={21}>
              {this.props.aliasAssets.selected ? (
                <div>
                  <h4 className='transactions-table-title'>Transactions</h4>
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
