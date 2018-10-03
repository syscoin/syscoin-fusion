// @flow
import React from 'react'
import { Icon } from 'antd'

type Props = {
  onMinimize: Function,
  onClose: Function
};

export default (props: Props) => (
  <div className='window-controls'>
    <Icon type='minus' className='minimize' onClick={props.onMinimize} />
    <Icon type='close' className='close' onClick={props.onClose} />
  </div>
)
