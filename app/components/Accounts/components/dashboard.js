// @flow
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import SysTransactionList from './sys-transaction-list'
import DashboardBalance from './dashboard-balance'
import DashboardTokens from './dashboard-tokens'

type Props = {
  balance: number,
  backgroundLogo: string,
  assets: Array<Object>,
  transactions: {
    isLoading: boolean,
    error: boolean,
    data: Array<Object>
  },
  assets: {
    isLoading: boolean,
    error: boolean,
    data: Array<Object>
  },
  refreshDashboardAssets: Function,
  refreshDashboardTransactions: Function,
  goToSysForm: Function,
  claimAssetInterest: Function
};

class Dashboard extends Component<Props> {
  render() {
    return (
      <div>
        <img src={this.props.backgroundLogo} alt='sys-logo' className='sys-logo-bg' />
        <Row>
          <Col xs={18} offset={3}>
            <div className='wallet-summary-container'>
              <h3 className='wallet-summary-title'>Wallet summary</h3>
              <DashboardBalance
                balance={this.props.balance}
                goToSysForm={this.props.goToSysForm}
              />
              <hr />
              <DashboardTokens
                isLoading={this.props.assets.isLoading}
                error={this.props.assets.error}
                assets={this.props.assets.data}
                refresh={this.props.refreshDashboardAssets}
                claimAssetInterest={this.props.claimAssetInterest}
              />
              <hr />
              <SysTransactionList
                data={this.props.transactions.data}
                error={this.props.transactions.error}
                isLoading={this.props.transactions.isLoading}
                refresh={this.props.refreshDashboardTransactions}
              />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard