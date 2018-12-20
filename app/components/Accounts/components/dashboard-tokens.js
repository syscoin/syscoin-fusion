// @flow
import React, { Component } from 'react'
import { Icon, Tooltip, Dropdown, Menu } from 'antd'
import swal from 'sweetalert'
import Table from './table'
import moment from 'moment'

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
        render: (row: object) => {
          const claimable = row.interestData.filter(i => moment().subtract(1, 'month') > moment(i.lastClaimedInterest))

          return (
            <div>
              <Dropdown
                overlay={(
                  <Menu>
                    <Item onClick={() => this.claimAll(row.asset, claimable.map(i => i.alias))} disabled={!(claimable.length)}>Claim interest</Item>
                  </Menu>
                )}
                trigger={['click']}
              >
                <Icon type='setting' className='token-table-actions' />
              </Dropdown>
              {claimable.length ? (
                <Tooltip title={`You have ${claimable.reduce((prev, curr) => prev + curr.accumulatedInterest, 0)} of accumulated interest on this asset from aliases: ${claimable.map(i => i.alias).join(', ')}`}>
                  <Icon type='info-circle' className='token-table-info' />
                </Tooltip>
              ) : null}
            </div>
          )
        }
      }
    ]
  }

  claimAll(asset, aliases) {
    this.props.claimAllInterestFromAsset(asset, aliases)
      .then(() => swal('Success', 'Successfully claimed interest', 'success'))
      .catch(() => swal('Error', 'Error while claiming interest', 'error'))
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
