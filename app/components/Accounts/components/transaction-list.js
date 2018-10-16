// @flow
import React, { Component } from 'react'
import { Icon, Table } from 'antd'
import moment from 'moment'

type Props = {
  data: Array<Object>,
  error: boolean,
  isLoading: boolean,
  selectedAlias: string
};

export default class TransactionList extends Component<Props> {

  cutTextIfNeeded(text: string) {
    return text.length > 13 ? `${text.slice(0, 12)}...` : text
  }

  generateColumns() {
    return [
      {
        title: ' ',
        key: 'asset',
        dataIndex: 'asset',
        render: (text: string, transaction: Object) => (
          <Icon
            className={`arrow ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}
            type={`arrow-${this.isIncoming(transaction) ? 'down' : 'up'}`}
          />
        )
      },
      {
        title: 'From',
        key: 'sender',
        dataIndex: 'sender',
        render: (text: string) => <span title={text}>{this.cutTextIfNeeded(text)}</span>
      },
      {
        title: 'To',
        key: 'receiver',
        dataIndex: 'receiver',
        render: (text: string) => <span title={text}>{this.cutTextIfNeeded(text)}</span>
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
        render: (amount: string, transaction: Object) => ({
          children: <span className={`amount ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}>{this.isIncoming(transaction) ? '+' : '-'}{amount}</span>,
          props: {
            width: 150
          }
        })
      }
    ]
  }

  isIncoming(transaction: Object) {
    if (transaction.receiver === this.props.selectedAlias) {
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

    return data
  }

  render() {
    return (
      <Table
        dataSource={this.prepareData()}
        columns={this.generateColumns()}
        className='transactions-table'
        rowClassName='transactions-table-row'
        rowKey='txid'
        pagination={{
          defaultPageSize: 10
        }}
        locale={{
          emptyText: this.defineLocales()
        }}
      />
    )
  }
}