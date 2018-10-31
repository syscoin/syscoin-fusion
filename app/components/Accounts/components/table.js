// @flow
import React, { Component } from 'react'
import { Table } from 'antd'

type Props = {
  data: Array<Object>,
  error: boolean,
  isLoading: boolean,
  columns: Array<Object>,
  rowKey: string,
  pageSize: number
};

export default class SysTransactionList extends Component<Props> {

  generateColumns() {
    return this.props.columns
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
        dataSource={this.props.data || []}
        columns={this.props.columns || []}
        className='transactions-table'
        rowClassName='transactions-table-row'
        rowKey={this.props.rowKey || 'txid'}
        pagination={{
          defaultPageSize: this.props.pageSize || 10
        }}
        locale={{
          emptyText: this.defineLocales()
        }}
      />
    )
  }
}