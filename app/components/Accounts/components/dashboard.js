/* eslint-disable jsx-a11y/alt-text */
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
  claimAllInterestFromAsset: Function,
  t: Function
};

class Dashboard extends Component<Props> {
  render() {
    const { t } = this.props
    return (
      <div>
        <object className='sys-logo-bg' data={this.props.backgroundLogo} type="image/svg+xml" />
        <Row>
          <Col xs={18} offset={3}>
            <div className='wallet-summary-container'>
              <h3 className='wallet-summary-title'>{t('accounts.summary.title')}</h3>
              <DashboardBalance
                balance={this.props.balance}
                goToSysForm={this.props.goToSysForm}
                t={t}
              />
              <hr />
              <DashboardTokens
                isLoading={this.props.assets.isLoading}
                error={this.props.assets.error}
                assets={this.props.assets.data}
                refresh={this.props.refreshDashboardAssets}
                claimAllInterestFromAsset={this.props.claimAllInterestFromAsset}
                t={t}
              />
              <hr />
              <SysTransactionList
                data={this.props.transactions.data}
                error={this.props.transactions.error}
                isLoading={this.props.transactions.isLoading}
                refresh={this.props.refreshDashboardTransactions}
                t={t}
              />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard