// @flow
import React, { Component } from 'react'
import { Icon, Button } from 'antd'
import Table from './table'

type Props = {
  assets: Array<{
    balance: number,
    symbol: string,
    asset: string
  }>,
  isLoading: boolean,
  error: boolean,
  refresh: Function,
  claimAssetInterest: Function
};

export default class DashboardBalance extends Component<Props> {

  generateTableColumns() {
    return [
      {
        title: 'Symbol',
        key: 'symbol',
        dataIndex: 'symbol',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: 'Asset',
        key: 'asset',
        dataIndex: 'asset',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: 'Balance',
        key: 'balance',
        dataIndex: 'balance',
        render: (text: number) => <span>{text}</span>
      },
      {
        title: 'Interest claim height',
        key: 'interest_claim_height',
        dataIndex: 'interest_claim_height',
        width: '20%',
        render: (text: number) => <span>{text}</span>
      },
      {
        title: '',
        key: 'interest_clain_height',
        dataIndex: 'interest_claim_height',
        render: (text: number, row: object) => <Icon onClick={() => this.props.claimAssetInterest(row.asset)} type='wallet' />
      }
    ]
  }

  render() {
    return (
      <div className='wallet-summary-balance-container'>
        <h3 className='wallet-summary-balance-title'>
          Total Tokens {!this.props.isLoading && (
            <Icon
              type='reload'
              className='dashboard-refresh'
              onClick={this.props.refresh}
            />
          )}
        </h3>
        <Table
          data={this.props.assets}
          columns={this.generateTableColumns()}
          rowKey='asset'
          isLoading={this.props.isLoading}
          error={this.props.error}
        />
      </div>
    )
  }
}
