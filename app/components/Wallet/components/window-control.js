// @flow
import React from 'react'
import { Icon, Spin } from 'antd'

type Props = {
  onMinimize: Function,
  onClose: Function,
  syncPercentage: number,
  currentBlock: number,
  headBlock: number
};

export default (props: Props) => (
  <div className='window-controls'>
    {props.syncPercentage < 100 && (
      <Spin indicator={<Icon
        className='window-controls-loader'
        type='loading'
        spin
        title={`${props.syncPercentage}% synced: ${props.currentBlock} out of ${props.headBlock} blocks downloaded`} />}
      />
    )}
    <Icon type='minus' className='minimize' onClick={props.onMinimize} />
    <Icon type='close' className='close' onClick={props.onClose} />
  </div>
)
