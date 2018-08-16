// @flow
import React, { Component } from 'react'
import { Input, Button, Select } from 'antd'
import swal from 'sweetalert'

const { Option } = Select

type Props = {
  createNewAlias: Function,
  getUnfinishedAliases: Function,
  pushNewAlias: Function,
  removeFinishedAlias: Function,
  aliasName: string,
  publicValue: string,
  acceptTransferFlags: number,
  expireTimestamp: string,
  address: string,
  encryptionPrivKey: string,
  encryptionPublicKey: string,
  witness: string,
  updateFields: Function
};
type State = {
  isLoading: boolean
};

export default class NewAlias extends Component<Props, State> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  generateUnfinishedAliases() {
    try {
      return (
        <ul>
          Unfinished aliases:
          {this.props.getUnfinishedAliases().map(i => (
            <li key={JSON.stringify(i)}>{i.alias}</li>
          ))}
        </ul>
      )
    } catch(e) {
      return []
    }
  }

  createNewAlias() {
    this.setState({
      isLoading: true
    })
    this.props.createNewAlias({
      aliasName: this.props.aliasName,
      publicValue: this.props.publicValue,
      acceptTransferFlags: this.props.acceptTransferFlags,
      expireTimestamp: this.props.expireTimestamp,
      address: this.props.address,
      encryptionPrivKey: this.props.encryptionPrivKey,
      encryptionPublicKey: this.props.encryptionPublicKey,
      witness: this.props.witness,
    }, (err) => {
      this.setState({
        isLoading: false
      })
      if (err) {
        return swal('Error', err.toString(), 'error')
      }

      this.props.pushNewAlias({
        alias: this.props.aliasName,
        round: 1,
        block: global.appStorage.get('walletinfo').blocks
      })

      swal('Success', 'Alias created. It will be available in 2 blocks.', 'success')
    })
  }

  render() {
    return (
      <div className='create-alias'>
        <h3 className='white-text'>Create new alias</h3>
        <div>
          {this.generateUnfinishedAliases()}
        </div>
        <Input
          name='aliasName'
          placeholder='New alias name'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.aliasName}
        />
        <Input
          name='publicValue'
          placeholder='Public Value'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.publicValue}
        />
        <Select
          name='acceptTransferFlags'
          placeholder='Accept Transfer Flag'
          onChange={e => this.props.updateFields({
            target: {
              name: 'acceptTransferFlags',
              value: e
            }
          }, 'newAlias')}
          style={{width: '100%'}}
          value={this.props.acceptTransferFlags}
        >
          <Option value={0}>0 - None</Option>
          <Option value={1}>1 - Accepting certificate transfers</Option>
          <Option value={2}>2 - Accepting asset transfers</Option>
          <Option value={3}>3 - All</Option>
        </Select>
        <Input
          name='expireTimestamp'
          placeholder='Expire timestamp'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.expireTimestamp}
        />
        <Input
          name='address'
          placeholder='Address'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.address}
        />
        <Input
          name='encryptionPrivKey'
          placeholder='Encryption Private Key'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.encryptionPrivKey}
        />
        <Input
          name='encryptionPublicKey'
          placeholder='Encryption Public Key'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.encryptionPublicKey}
        />
        <Input
          name='witness'
          placeholder='Witness'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.witness}
        />
        <div style={{textAlign: 'right', padding: '10px 0 10px 0'}}>
          <Button
            disabled={!this.props.aliasName || this.state.isLoading}
            onClick={this.createNewAlias.bind(this)}
          >
            Send
          </Button>
        </div>
      </div>
    )
  }
}
