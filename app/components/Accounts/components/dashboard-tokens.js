// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import Table from './table'

type Props = {
  assets: Array<{
    balance: number,
    symbol: string,
    asset: string
  }>,
  isLoading: boolean,
  error: boolean
};

export default class DashboardBalance extends Component<Props> {

  generateTableColumns() {
    return [
      {
        title: 'Symbol',
        key: 'symbol',
        dataIndex: 'symbol',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: 'Asset',
        key: 'asset',
        dataIndex: 'asset',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: 'Balance',
        key: 'balance',
        dataIndex: 'balance',
        render: (text: number) => <span>{text}</span>
      }
    ]
  }

  render() {
    return (
      <Row>
        <Col xs={24}>
          <div className='wallet-summary-balance-container'>
            <h3 className='wallet-summary-balance-title'>Total Tokens</h3>
            <Table
              data={this.props.assets}
              columns={this.generateTableColumns()}
              rowKey='asset'
              pageSize={10}
              isLoading={this.props.isLoading}
              error={this.props.error}
            />
          </div>
        </Col>
      </Row>
    )
  }
}
