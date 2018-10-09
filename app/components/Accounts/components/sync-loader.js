// @flow
import React from 'react'
import { Icon, Spin, Tooltip } from 'antd'

type Props = {
  syncPercentage: number,
  currentBlock: number,
  headBlock: number
};

export default (props: Props) => (
  <Tooltip
    placement='top'
    title={`${props.syncPercentage}% synced: ${props.currentBlock} out of ${props.headBlock} blocks processed.
This might affect some wallet functionalities.`}
  >
    <Spin
      className='sync-loader'
      indicator={
        <Icon
          type='loading'
          spin
        />
      }
    />
  </Tooltip>
)
