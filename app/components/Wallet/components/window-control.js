// @flow
import React from 'react'
import { Icon } from 'antd'
import MaximizeIcon from './maximize'
import UnmaximizeIcon from './unmaximize'

type Props = {
  isMaximized: boolean,
  onMinimize: Function,
  onClose: Function,
  onMaximize: Function,
  onUnmaximize: Function
};

export default (props: Props) => (
  <div className='window-controls'>
    <div className='window-controls-drag' />
    <div className='window-controls-buttons'>
      <Icon type='minus' className='minimize' onClick={props.onMinimize} />
      <i className={props.isMaximized ? 'maximize' : 'unmaximize'}>
        {
          props.isMaximized ? <MaximizeIcon /> : <UnmaximizeIcon />
        }
      </i>
      <Icon type='close' className='close' onClick={props.onClose} />
    </div>
  </div>
)