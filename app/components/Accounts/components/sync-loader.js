// @flow
import React from 'react'
import { Icon, Spin, Tooltip } from 'antd'

type Props = {
  syncPercentage: number,
  currentBlock: number,
  headBlock: number,
  isSynced: boolean,
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
    {props.isSynced ?
      <Icon className='sync-loader sync-loaded' type='check' />
      : <Spin
        className='sync-loader'
        indicator={
          <Icon
            type='loading'
            spin
          />
        }
      />}
  </Tooltip>
)
