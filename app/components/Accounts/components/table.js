// @flow
import React, { Component } from 'react'
import { Table } from 'antd'

type Props = {
  data: Array<Object>,
  error: boolean,
  isLoading: boolean,
  columns: Array<Object>,
  rowKey: string,
  pageSize?: number,
  t: Function
};

class SysTransactionList extends Component<Props> {

  generateColumns() {
    return this.props.columns
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

  render() {
    const { data, columns, rowKey, pageSize, ...props} = this.props
    return (
      <Table
        dataSource={data || []}
        columns={columns || []}
        className='transactions-table'
        rowClassName='transactions-table-row'
        rowKey={rowKey || 'txid'}
        pagination={{
          defaultPageSize: pageSize || 10
        }}
        locale={{
          emptyText: this.defineLocales()
        }}
        {...props}
      />
    )
  }
}

SysTransactionList.defaultProps = {
  pageSize: 10
}

export default SysTransactionList