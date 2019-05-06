// @flow
import React, { Component } from 'react'
import { Icon } from 'antd'
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
  t: Function
};

export default class DashboardBalance extends Component<Props> {

  generateTableColumns() {
    const { t } = this.props

    return [
      {
        title: t('misc.symbol'),
        key: 'publicvalue',
        dataIndex: 'publicvalue',
        render: (text: string) => <span>{text.toUpperCase()}</span>
      },
      {
        title: t('misc.asset'),
        dataIndex: 'asset_guid',
        render: (text: number) => <span>{text}</span>
      },
      {
        title: t('misc.balance'),
        dataIndex: 'balance',
        render: (text: string) => <span>{text}</span>
      }
    ]
  }

  render() {
    const { t } = this.props
    return (
      <div className='wallet-summary-balance-container'>
        <h3 className='wallet-summary-balance-title'>
          {t('accounts.summary.total_tokens')} {!this.props.isLoading && (
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
          rowKey='asset_guid'
          isLoading={this.props.isLoading}
          error={this.props.error}
          t={t}
        />
      </div>
    )
  }
}
