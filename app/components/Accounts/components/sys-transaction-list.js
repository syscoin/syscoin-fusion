// @flow
import React, { Component } from 'react'
import { Icon } from 'antd'
import moment from 'moment'
import Table from './table'

type Props = {
  data: Array<Object>,
  error: boolean,
  isLoading: boolean
};

export default class SysTransactionList extends Component<Props> {

  cutTextIfNeeded(text: string) {
    return text.length > 13 ? `${text.slice(0, 12)}...` : text
  }

  generateColumns() {
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
        title: 'To',
        key: 'address',
        dataIndex: 'address',
        render: (text?: string = '') => <span title={text}>{this.cutTextIfNeeded(text)}</span>
      },
      {
        title: 'Date',
        key: 'time',
        dataIndex: 'time',
        render: (time: number) => <span>{moment(time).format('DD-MM-YY HH:mm')}</span>
      },
      {
        title: 'Details',
        key: 'amount',
        dataIndex: 'amount',
        render: (amount: number, transaction: Object) => ({
          children: <span className={`amount ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}>{this.isIncoming(transaction) ? '+' : '-'}{amount.toString().slice(1)}</span>,
          props: {
            width: 150
          }
        })
      }
    ]
  }

  isIncoming(transaction: Object) {
    if (transaction.amount[0] !== '-') {
      return true
    }

    return false
  }

  defineLocales() {
    let emptyText

    if (this.props.error) {
      emptyText = 'Something went wrong. Try again later'
    } else if (this.props.isLoading) {
      emptyText = 'Loading...'
    } else {
      emptyText = 'No data'
    }

    return emptyText
  }

  prepareData() {
    // Sort time by date - more recent first
    const data = this.props.data.sort((a, b) => b.time - a.time)
      .filter(i => i.address)

    return data
  }

  render() {
    return (
      <div className='wallet-summary-balance-container'>
        <h3 className='wallet-summary-balance-title'>SYS Transactions</h3>
        <Table
          data={this.prepareData()}
          columns={this.generateColumns()}
          rowKey='txid'
          pageSize={10}
          isLoading={this.props.isLoading}
          error={this.props.error}
        />
      </div>
    )
  }
}