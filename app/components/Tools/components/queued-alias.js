// @flow
import React from 'react'
import { Tag, Tooltip } from 'antd'

type Props = {
  error: string | null,
  aliasName: string
};

export default (props: Props) => (
  <Tooltip title={props.error || 'Queued'} placement='top'>
    <Tag color={props.error ? '#faa' : '#8bc0fd'}>{props.aliasName}</Tag>
  </Tooltip>
)
