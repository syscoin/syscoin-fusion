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
  claimAllInterestFromAsset: Function,
  t: Function
};

const { Item } = Menu

export default class DashboardBalance extends Component<Props> {

  generateTableColumns() {
    const { t } = this.props

    return [
      {
        title: t('misc.symbol'),
        key: 'symbol',
        dataIndex: 'symbol',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: t('misc.asset'),
        key: 'asset',
        dataIndex: 'asset',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: t('misc.balance'),
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
              {/* <Dropdown
                overlay={(
                  <Menu>
                    <Item onClick={() => this.claimAll(row.asset, claimable.map(i => i.alias))} disabled={!(claimable.length)}>{t('misc.claim_interest')}</Item>
                  </Menu>
                )}
                trigger={['click']}
              >
                <Icon type='setting' className='token-table-actions' />
              </Dropdown> */}
              {claimable.length ? (
                <Tooltip
                  title={t('accounts.summary.total_tokens_notification', {
                    amount: claimable.reduce((prev, curr) => prev + curr.accumulatedInterest, 0),
                    aliases: claimable.map(i => i.alias).join(', ')
                  })}
                >
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
    const { t } = this.props
    this.props.claimAllInterestFromAsset(asset, aliases)
      .then(() => swal(t('misc.success'), t('misc.claim_interest_success'), 'success'))
      .catch(() => swal(t('misc.error'), t('misc.claim_interest_error'), 'error'))
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
          // data={this.props.assets}
          data={[]}
          columns={this.generateTableColumns()}
          rowKey='asset'
          isLoading={this.props.isLoading}
          error={this.props.error}
          t={t}
        />
      </div>
    )
  }
}
