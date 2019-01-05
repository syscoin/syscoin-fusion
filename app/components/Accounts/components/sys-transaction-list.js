// @flow
import React, { Component } from 'react'
import { Icon } from 'antd'
import moment from 'moment'
import { uniqBy } from 'lodash'
import Table from './table'
import Pagination from './pagination'

type Props = {
  data: Array<Object>,
  error: boolean,
  isLoading: boolean,
  refresh: Function,
  t: Function
};

type State = {
  currentPage: number
};

export default class SysTransactionList extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      currentPage: 0
    }
  }

  cutTextIfNeeded(text: string) {
    return text.length > 13 ? `${text.slice(0, 12)}...` : text
  }

  generateColumns() {
    const { t } = this.props

    return [
      {
        title: ' ',
        key: 'txid',
        dataIndex: 'txid',
        render: (text: string, transaction: Object) => (
          <Icon
            className={`arrow ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}
            type={`arrow-${this.isIncoming(transaction) ? 'down' : 'up'}`}
          />
        )
      },
      {
        title: t('misc.address') + ' / ' + t('misc.label'),
        key: 'address',
        dataIndex: 'address',
        render: (text?: string = '', transaction: Object) => ({
          children: <span title={transaction.systx || transaction.systype || text}>{this.cutTextIfNeeded(transaction.systx || transaction.systype || text)}</span>,
          width: 200
        })
      },
      {
        title: t('misc.date'),
        key: 'time',
        dataIndex: 'time',
        render: (time: number) => <span>{moment(time).format('DD-MM-YY HH:mm')}</span>
      },
      {
        title: t('misc.details'),
        key: 'amount',
        dataIndex: 'amount',
        render: (amount: number, transaction: Object) => ({
          children: (
            <span className={`amount ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}>
              {this.isIncoming(transaction) ? '+' : '-'}{this.removeSigns(amount)}
            </span>
          ),
          props: {
            width: 120
          }
        })
      }
    ]
  }

  isIncoming(transaction: Object) {
    return transaction.category === 'receive'
  }

  removeSigns(amount: number) {
    return Math.abs(amount)
  }


  prepareData() {
    // Sort time by date - more recent first
    const data = this.props.data.sort((a, b) => b.time - a.time)

    return data
  }

  changePage(type: string) {
    this.setState({
      currentPage: type === 'next' ? this.state.currentPage + 1 : this.state.currentPage - 1
    }, () => {
      this.props.refresh(this.state.currentPage, 10)
    })
  }

  render() {
    const { t } = this.props

    return (
      <div className='wallet-summary-balance-container'>
        <h3 className='wallet-summary-balance-title'>
          {t('accounts.summary.sys_transactions')} {!this.props.isLoading && (
            <Icon
              type='reload'
              className='dashboard-refresh'
              onClick={this.props.refresh}
            />
          )}
        </h3>
        <Table
          data={this.prepareData()}
          columns={this.generateColumns()}
          rowKey='txid'
          pageSize={10}
          isLoading={this.props.isLoading}
          error={this.props.error}
          onChange={this.changePage}
          t={t}
        />
      </div>
    )
  }
}