// @flow
import React, { Component } from 'react'
import { Input, Button, Select, Tag } from 'antd'
import swal from 'sweetalert'

const { Option } = Select

type Props = {
  createNewAlias: Function,
  getUnfinishedAliases: Function,
  pushNewAlias: Function,
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

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  generateUnfinishedAliases() {
    try {
      return (
        <ul className='create-alias-unfinished-aliases-ul'>
          {this.props.getUnfinishedAliases().length && <span className='create-alias-unfinished-aliases-text'>Unfinished aliases:</span>}
          {this.props.getUnfinishedAliases().map(i => (
            <li key={JSON.stringify(i)} className='create-alias-unfinished-aliases-li'><Tag color='#8bc0fd'>{i.alias}</Tag></li>
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
      <div className='create-alias-container'>
        <h3 className='create-alias-title'>Create new alias</h3>
        <div className='create-alias-unfinished-aliases'>
          {this.generateUnfinishedAliases()}
        </div>
        <div className='create-alias-form-container'>
          <Input
            name='aliasName'
            placeholder='New alias name'
            onChange={e => this.props.updateFields(e, 'newAlias')}
            value={this.props.aliasName}
            className='create-alias-control create-alias-form-name'
          />
          <Input
            name='publicValue'
            placeholder='Public Value'
            onChange={e => this.props.updateFields(e, 'newAlias')}
            value={this.props.publicValue}
            className='create-alias-control create-alias-form-publicvalue'
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
            value={this.props.acceptTransferFlags}
            className='create-alias-control create-alias-form-transferflag'
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
            className='create-alias-control create-alias-form-timestamp'
          />
          <Input
            name='address'
            placeholder='Address'
            onChange={e => this.props.updateFields(e, 'newAlias')}
            value={this.props.address}
            className='create-alias-control create-alias-form-address'
          />
          <Input
            name='encryptionPrivKey'
            placeholder='Encryption Private Key'
            onChange={e => this.props.updateFields(e, 'newAlias')}
            value={this.props.encryptionPrivKey}
            className='create-alias-control create-alias-form-privkey'
          />
          <Input
            name='encryptionPublicKey'
            placeholder='Encryption Public Key'
            onChange={e => this.props.updateFields(e, 'newAlias')}
            value={this.props.encryptionPublicKey}
            className='create-alias-control create-alias-form-pubkey'
          />
          <Input
            name='witness'
            placeholder='Witness'
            onChange={e => this.props.updateFields(e, 'newAlias')}
            value={this.props.witness}
            className='create-alias-control create-alias-form-witness'
          />
          <div className='create-alias-form-btn-container'>
            <Button
              disabled={!this.props.aliasName || this.state.isLoading}
              loading={this.state.isLoading}
              onClick={this.createNewAlias.bind(this)}
              className='create-alias-form-btn-send'
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
