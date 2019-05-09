// @flow
import React from 'react'
import { Row, Col } from 'antd'
import SendButton from './send-button'

type Props = {
  balance: number,
  goToSysForm: Function,
  t: Function
};

const DashboardBalance = (props: Props) => (
  <Row>
    <Col xs={24}>
      <div className='wallet-summary-balance-container'>
        <h3 className='wallet-summary-balance-title'>{props.t('accounts.summary.total_sys')}</h3>
        <h3 className='wallet-summary-balance-number'>
          {props.balance}
          <SendButton
            className='wallet-summary-balance-send-btn'
            onClick={props.goToSysForm}
            t={props.t}
          />
        </h3>
      </div>
    </Col>
  </Row>
)

export default DashboardBalance