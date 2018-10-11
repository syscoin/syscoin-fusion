// @flow
import React from 'react'
import { Tag, Tooltip } from 'antd'

type Props = {
  error: string | null,
  aliasName: string
};

export default (props: Props) => (
  <Tooltip title={props.error || 'Queued'} placement='bottom'>
    <Tag color={props.error ? '#faa' : '#7fb2ec'}>{props.aliasName}</Tag>
  </Tooltip>
)
