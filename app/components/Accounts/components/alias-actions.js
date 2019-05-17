// @flow
import React, { Component } from 'react'
import { Icon, Tooltip } from 'antd'
import swal from 'sweetalert'
import SyncLoader from './sync-loader'

type Props = {
  t: Function,
  headBlock: number,
  currentBlock: number,
  getNewAddress: Function
};

export default class AliasActions extends Component<Props> {

  async getNewAddress() {
    const address = await this.props.getNewAddress()

    swal('Success', address, 'success')
  }

  getSyncPercentage() {
    const { currentBlock, headBlock } = this.props
    const sync = headBlock ? Number((currentBlock / headBlock).toFixed(2)) : 0

    return sync * 100
  }

  render() {
    const { props } = this
    return (
      <div className='alias-actions-container'>
        <Tooltip title='Get new address'>
          <Icon className='add-address' type='plus' onClick={() => this.getNewAddress()} />
        </Tooltip>
        <SyncLoader
          syncPercentage={this.getSyncPercentage()}
          headBlock={props.headBlock}
          isSynced={props.headBlock / props.currentBlock === 1}
          currentBlock={props.currentBlock}
          t={props.t}
        />
      </div>
    )
  }
}
