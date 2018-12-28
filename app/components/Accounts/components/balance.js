// @flow
import React from 'react'

type Props = {
  currentBalance: number,
  t: Function
};

export default (props: Props) => (
  <div className='balance-container'>
    <h4 className='your-balance-title'>
      {props.t('accounts.panel.your_balance')}
    </h4>
    <h2 className='your-balance-amount'>
      {props.currentBalance} {props.t('misc.sys')}
    </h2>
  </div>
)
