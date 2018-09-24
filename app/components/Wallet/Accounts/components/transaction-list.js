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

  generateColumns() {
    return [
      {
        title: ' ',
        key: 'symbol',
        dataIndex: 'symbol',
        render: (text, transaction) => (
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
        render: text => <span>{text}</span>
      },
      {
        title: 'To',
        key: 'receiver',
        dataIndex: 'receiver',
        render: text => <span>{text}</span>
      },
      {
        title: 'Date',
        key: 'time',
        dataIndex: 'time',
        render: time => <span>{moment(time).format('DD-MM-YYYY HH:mm')}</span>
      },
      {
        title: 'Details',
        key: 'amount',
        dataIndex: 'amount',
        render: (amount, transaction) => ({
          children: <span className={`amount ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}>{this.isIncoming(transaction) ? '+' : '-'}{amount}</span>,
          props: {
            width: 150
          }
        })
      }
    ]
  }

  isIncoming(transaction) {
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

  render() {
    return (
      <Table
        dataSource={this.props.data.sort((a, b) => b.time - a.time)}
        columns={this.generateColumns()}
        className='transactions-table'
        rowClassName='transactions-table-row'
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