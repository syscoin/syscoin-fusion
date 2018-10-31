// @flow
import React, { Component } from 'react'
import { Row, Col, Icon, Spin, Tooltip } from 'antd'
import swal from 'sweetalert'
import parseError from 'fw-utils/error-parser'
import SysTransactionList from './sys-transaction-list'

type Props = {
  backgroundLogo: string,
  assets: Array<Object>,
  transactions: {
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
            <SysTransactionList
              data={this.props.transactions.data}
              error={this.props.transactions.error}
              isLoading={this.props.transactions.isLoading}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard