// @flow
import React, { Component } from 'react'
import { Icon } from 'antd'
import Table from './table'

type Props = {
  assets: Array<{
    balance: number,
    publicvalue: any,
    asset_guid: number
  }>,
  isLoading: boolean,
  error: boolean,
  refresh: Function,
  t: Function
};

export default class DashboardBalance extends Component<Props> {

  generateTableColumns() {
    const { t } = this.props

    return [
      {
        title: t('misc.symbol'),
        dataIndex: 'symbol',
        render: (text: string, asset: Object) => <span>{text.toUpperCase()} {asset.isOwner && <Icon type='star' />}</span>
      },
      {
        title: t('misc.asset'),
        dataIndex: 'asset_guid',
        render: (text: number) => <span>{text}</span>
      },
      {
        title: t('misc.balance'),
        dataIndex: 'balance',
        render: (text: number) => <span>{text}</span>
      }
    ]
  }

  addRandomKeyToData() {
    return this.props.assets.map(i => {
      // eslint-disable-next-line no-param-reassign
      i.randomKey = Math.random()

      return i
    })
  }

  render() {
    const { t } = this.props
    return (
      <div className='wallet-summary-balance-container'>
        <h3 className='wallet-summary-balance-title'>
          {'Total Tokens & Assets'} {!this.props.isLoading && (
            <Icon
              type='reload'
              className='dashboard-refresh'
              onClick={this.props.refresh}
            />
          )}
        </h3>
        <Table
          data={this.addRandomKeyToData()}
          columns={this.generateTableColumns()}
          rowKey='randomKey'
          isLoading={this.props.isLoading}
          error={this.props.error}
          t={t}
        />
      </div>
    )
  }
}
