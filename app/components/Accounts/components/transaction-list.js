// @flow
import React, { Component } from 'react'
import goToDetail from 'fw/utils/helpers/go-to-transaction-detail'
import goToBlock from 'fw/utils/helpers/go-to-block-detail'
import { Icon, Table, Tooltip } from 'antd'
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
        title: t('misc.address'),
        dataIndex: 'sender',
        render: (text: string, transaction: object) => <div>{this.getAddressFromTransaction(transaction).map(i => <div key={Math.random()}><span>{i}</span></div>)}</div>
      },
      {
        title: t('misc.details'),
        dataIndex: 'allocations',
        render: (allocations: array, transaction: object) => <span className={`amount ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}>{this.getAmountFromTransaction(transaction)}</span>
      },
      {
        title: '',
        dataIndex: 'txid',
        render: (txid: string, transaction: object) => ({
          children: (
            <div>
              <Tooltip title='See transaction in block explorer.' placement='left'>
                <Icon
                  className='transaction-list-action-button'
                  type='bars'
                  onClick={() => goToDetail(txid)}
                />
              </Tooltip>
              <Tooltip title='See block in block explorer.' placement='left'>
                <Icon
                  className='transaction-list-action-button'
                  type='appstore'
                  onClick={() => goToBlock(transaction.blockhash)}
                />
              </Tooltip>
            </div>
          )
        })
      }
    ]
  }

  getAddressFromTransaction(transaction) {
    if (this.isIncoming(transaction)) {
      return [transaction.sender]
    }

    return transaction.allocations.map(i => i.address)
  }

  getAmountFromTransaction(transaction) {
    const { selectedAlias } = this.props

    if (!this.isIncoming(transaction)) {
      return Number(transaction.total).toFixed(2)
    }

    const amount = transaction.allocations.reduce((prev, curr) => {
      const prevAmount = Number(prev)
      const currAmount = Number(curr.amount)

      if (selectedAlias === curr.address) {
        return currAmount + prevAmount
      }

      return prevAmount
    }, 0)

    return amount.toFixed(2)
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
      emptyText = `${t('misc.loading')}...`
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
          rowKey='random'
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