// @flow
import React, { Component } from 'react'
import { Icon, Tooltip } from 'antd'
import Table from './table'

type Props = {
  assets: Array<{
    balance: number,
    symbol: string,
    asset: string
  }>,
  isLoading: boolean,
  error: boolean,
  refresh: Function
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
        title: '',
        key: 'accumulated_interest',
        dataIndex: 'accumulated_interest',
        render: (text: number, row: object) => (
          <Tooltip title={`You have ${row.accumulated_interest} of accumulated interest on this asset.`}>
            <Icon type='info-circle' className='token-table-info' />
          </Tooltip>
        )
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
