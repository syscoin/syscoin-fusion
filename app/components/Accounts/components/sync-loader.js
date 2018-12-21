// @flow
import React from 'react'
import { Icon, Spin, Tooltip } from 'antd'

type Props = {
  syncPercentage: number,
  currentBlock: number,
  headBlock: number,
  t: Function
};

export default (props: Props) => (
  <Tooltip
    placement='top'
    title={props.t('accounts.panel.syncing', {
      syncPercentage: props.syncPercentage,
      currentBlock: props.currentBlock,
      headBlock: props.headBlock
    })}
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
