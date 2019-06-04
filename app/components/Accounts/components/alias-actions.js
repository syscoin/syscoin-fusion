// @flow
import React, { Component } from 'react'
import { Icon, Tooltip, Popover, Input, Checkbox } from 'antd'
import swal from 'sweetalert'
import SyncLoader from './sync-loader'

type Props = {
  t: Function,
  changeFilter: Function,
  filters: Object,
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

  generateAddressFilter() {
    const { changeFilter, filters } = this.props
    return (
      <div>
        <Input
          autofocus='true'
          suffix={filters.addressFilter ?
            <Icon
              type='close'
              onClick={() => changeFilter('addressFilter', '')}
              style={{ cursor: 'pointer' }}
            />
            : <Icon type='search' />
          }
          placeholder='Address or label'
          onChange={e => changeFilter('addressFilter', e.target.value)}
          value={filters.addressFilter}
        />
      </div>
    )
  }

  generateAddressOptions() {
    return (
      <div>
        <div className='alias-actions-checkbox'>
          <Checkbox>Show change addresses</Checkbox>
        </div>
        <div className='alias-actions-checkbox'>
          <Checkbox>Show change addresses with zero balance</Checkbox>
        </div>
      </div>
    )
  }

  render() {
    const { props } = this
    return (
      <div className='alias-actions-container'>
        <Popover content={this.generateAddressOptions()} placement='bottom' trigger='click'>
          <Icon className='add-address' type='setting' trigger='click' />
        </Popover>
        <Popover content={this.generateAddressFilter()} placement='bottom' trigger='click'>
          <Icon className='add-address' type='search' trigger='click' />
        </Popover>
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
