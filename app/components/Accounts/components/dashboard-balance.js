// @flow
import React from 'react'
import { Row, Col } from 'antd'

type Props = {
  balance: number
};

const DashboardBalance = (props: Props) => (
  <Row>
    <Col xs={24}>
      <div className='wallet-summary-balance-container'>
        <h3 className='wallet-summary-balance-title'>Total SYS</h3>
        <h3 className='wallet-summary-balance-number'>{props.balance.toFixed(2)}</h3>
      </div>
    </Col>
  </Row>
)

export default DashboardBalance