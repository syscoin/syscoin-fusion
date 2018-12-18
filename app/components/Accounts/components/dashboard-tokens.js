// @flow
import React, { Component } from 'react'
import { Icon, Tooltip, Button, Dropdown, Menu } from 'antd'
import swal from 'sweetalert'
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
  claimAllInterestFromAsset: Function
};

const { Item } = Menu

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
        render: (row: object) => (
          <div>
            <Dropdown
              overlay={(
                <Menu>
                  <Item onClick={() => this.claimAll(row.asset)}>Claim interest</Item>
                </Menu>
              )}
              trigger={['click']}
            >
              <Icon type='setting' className='token-table-actions' />
            </Dropdown>
            <Tooltip title={`You have ${row.accumulated_interest} of accumulated interest on this asset.`}>
              <Icon type='info-circle' className='token-table-info' />
            </Tooltip>
          </div>
        )
      }
    ]
  }

  async claimAll(asset) {
    try {
      await this.props.claimAllInterestFromAsset(asset)
    } catch(err) {
      return swal('Error', 'Error while claiming interest', 'error')
    }

    return swal('Success', 'Successfully claimed interest', 'success')
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
