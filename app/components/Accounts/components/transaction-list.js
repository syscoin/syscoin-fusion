// @flow
import React, { Component } from 'react'
import { Icon, Table } from 'antd'
import Pagination from './pagination'

type Props = {
  changePage: Function,
  data: Array<Object>,
  error: boolean,
  isLoading: boolean,
  selectedAlias: string,
  selectedSymbol: string,
  t: Function
};

export default class TransactionList extends Component<Props> {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentPage: 0
    }
  }

  changePage(page: number) {
    this.setState({
      currentPage: page
    }, () => {
      this.props.changePage(this.state.currentPage)
    })
  }

  cutTextIfNeeded(text: string) {
    return text.length > 13 ? `${text.slice(0, 24)}...` : text
  }

  generateColumns() {
    const { t } = this.props
    return [
      {
        title: ' ',
        key: 'random',
        dataIndex: 'asset_guid',
        render: (asset: number, transaction: Object) => (
          <Icon
            className={`arrow ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}
            type={`arrow-${this.isIncoming(transaction) ? 'down' : 'up'}`}
          />
        )
      },
      {
        title: t('misc.from'),
        dataIndex: 'sender',
        render: (text: string) => <span title={text}>{this.cutTextIfNeeded(text)}</span>
      },
      {
        title: t('misc.to'),
        dataIndex: 'allocations',
        render: (arr: array) => <span title={arr[0].address}>{this.cutTextIfNeeded(arr[0].address)}</span>
      },
      {
        title: t('misc.details'),
        dataIndex: 'total',
        render: (total: string, transaction: Object) => ({
          children: <span className={`amount ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}>{this.isIncoming(transaction) ? '+' : '-'}{total}</span>,
          props: {
            width: 150
          }
        })
      }
    ]
  }

  isIncoming(transaction: Object) {
    return transaction.sender !== this.props.selectedAlias
  }

  defineLocales() {
    const { t } = this.props
    let emptyText

    if (this.props.error) {
      emptyText = t('misc.try_again_later')
    } else if (this.props.isLoading) {
      emptyText = t('misc.loading') + '...'
    } else {
      emptyText = t('misc.no_data')
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
      <div className='token-transaction-list'>
        <h4 className='transactions-table-title'>{this.props.t('accounts.asset.transactions_for', { asset: this.props.selectedSymbol })}</h4>
        <Table
          dataSource={this.prepareData()}
          columns={this.generateColumns()}
          className='transactions-table'
          rowClassName='transactions-table-row'
          rowKey='txid'
          pagination={false}
          locale={{
            emptyText: this.defineLocales()
          }}
        />
        <Pagination
          showPage
          currentPage={this.state.currentPage}
          t={this.props.t}
          prevDisabled={this.state.currentPage === 0}
          nextDisabled={this.prepareData().length < Number(process.env.TABLE_PAGINATION_LENGTH)}
          onChange={(page) => this.changePage(page)}
        />
      </div>
    )
  }
}