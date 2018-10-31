// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import swal from 'sweetalert'
import parseError from 'fw-utils/error-parser'
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
    errorMessage: string,
    data: Array<Object>
  },
  assets: {
    isLoading: boolean,
    error: boolean,
    errorMessage: string,
    data: Array<Object>
  }
};

type State = {
};

class Dashboard extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div>
        <img src={this.props.backgroundLogo} alt='sys-logo' className='sys-logo-bg' />
        <Row>
          <Col xs={18} offset={3}>
            <div className='wallet-summary-container'>
              <h3 className='wallet-summary-title'>Wallet summary</h3>
              <DashboardBalance balance={this.props.balance} />
              <hr />
              <DashboardTokens
                isLoading={this.props.assets.isLoading}
                error={this.props.assets.error}
                assets={this.props.assets.data}
              />
              <hr />
              <SysTransactionList
                data={this.props.transactions.data}
                error={this.props.transactions.error}
                isLoading={this.props.transactions.isLoading}
              />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard