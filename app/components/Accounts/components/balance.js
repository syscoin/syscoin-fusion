// @flow
import React from 'react'

type Props = {
  currentBalance: number
};

export default (props: Props) => (
  <div className='balance-container'>
    <h4 className='your-balance-title'>
      Your balance
    </h4>
    <h2 className='your-balance-amount'>
      {Number(props.currentBalance).toFixed(2)} SYS
    </h2>
  </div>
)
