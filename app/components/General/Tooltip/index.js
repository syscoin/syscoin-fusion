// @flow
import React from 'react'
import { Icon, Tooltip } from 'antd'

export default props => (
  <Tooltip {...props}>
    <Icon className='tooltip-icon' type='question' />
  </Tooltip>
)
