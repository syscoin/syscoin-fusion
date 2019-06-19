// @flow
import React, { Component } from 'react'
import { Icon } from 'antd'
import moment from 'moment'
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

  shouldComponentUpdate(nextProps) {
    return nextProps.data.length !== this.props.data.length || nextProps.isLoading !== this.props.isLoading
  }

  cutTextIfNeeded(text: string) {
    return text.length > 20 ? `${text.slice(0, 20)}...` : text
  }

  generateColumns() {
    const { t } = this.props

    return [
      {
        title: ' ',
        dataIndex: 'txid',
        render: (text: string, transaction: Object) => (
          <Icon
            className={`arrow ${this.isIncoming(transaction) ? 'incoming' : 'outgoing'}`}
            type={`arrow-${this.isIncoming(transaction) ? 'down' : 'up'}`}
          />
        )
      },
      {
        title: `${t('misc.address')}/${t('misc.label')}`,
        dataIndex: 'address',
        render: (text: string = '') => (
          <span title={text}>{this.cutTextIfNeeded(text)}</span>
        )
      },
      {
        title: t('misc.date'),
        dataIndex: 'time',
        render: (time: number) => <span>{moment(time).format('DD-MM-YY HH:mm')}</span>
      },
      {
        title: t('misc.details'),
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
    return transaction.category !== 'send'
  }

  removeSigns(amount: number) {
    return Math.abs(amount)
  }


  prepareData() {
    // Sort time by date - more recent first
    const data = this.props.data
      .sort((a, b) => b.time - a.time)
      .map(i => {
        // eslint-disable-next-line no-param-reassign
        i.randomKey = Math.random()
        return i
      })

    return data
  }

  changePage(page: number) {
    this.setState({
      currentPage: page
    }, () => {
      this.props.refresh(this.state.currentPage)
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
              onClick={() => this.changePage(0)}
            />
          )}
        </h3>
        <Table
          data={this.prepareData()}
          columns={this.generateColumns()}
          pageSize={25}
          pagination={false}
          isLoading={this.props.isLoading}
          error={this.props.error}
          onChange={this.changePage}
          rowKey='randomKey'
          t={t}
        />
        <Pagination
          showPage
          currentPage={this.state.currentPage}
          t={t}
          prevDisabled={this.state.currentPage === 0}
          nextDisabled={this.prepareData().length < Number(process.env.TABLE_PAGINATION_LENGTH)}
          onChange={(page) => this.changePage(page)}
        />
      </div>
    )
  }
}