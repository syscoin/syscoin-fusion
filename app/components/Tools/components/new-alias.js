// @flow
import React, { Component } from 'react'
import { Input, Button, Select, Tag } from 'antd'
import swal from 'sweetalert'
import formChangeFormat from 'fw-utils/form-change-format'
import parseError from 'fw-utils/error-parser'

const { Option } = Select

type Props = {
  unfinishedAliases: Array<{
    aliasName: string,
    block: number,
    round: number
  }>,
  createNewAlias: Function,
  title: string,
  currentBlock: number
};
type State = {
  isLoading: boolean,
  aliasName: string,
  publicValue: string,
  acceptTransferFlags: number,
  expireTimestamp: string,
  address: string,
  encryptionPrivKey: string,
  encryptionPublicKey: string,
  witness: string
};

export default class NewAlias extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.initialState = {
      aliasName: '',
      publicValue: '',
      acceptTransferFlags: -1,
      expireTimestamp: '',
      address: '',
      encryptionPrivKey: '',
      encryptionPublicKey: '',
      witness: '',
      isLoading: false
    }

    this.state = {...this.initialState}
  }

  updateField(value, name) {
    const toUpdate = formChangeFormat(value, name)

    this.setState(toUpdate)
  }

  cleanForm() {
    this.setState({...this.initialState})
  }

  generateUnfinishedAliases() {
    const { unfinishedAliases } = this.props
    return unfinishedAliases.length ? (
      <ul className='create-alias-unfinished-aliases-ul'>
        {<span className='create-alias-unfinished-aliases-text'>Unfinished aliases:</span>}
        {unfinishedAliases.map(i => (
          <li key={i.aliasName} className='create-alias-unfinished-aliases-li'><Tag color='#8bc0fd'>{i.aliasName}</Tag></li>
        ))}
      </ul>
    ) : []
  }

  createNewAlias() {
    this.setState({
      isLoading: true
    })
    this.props.createNewAlias({
      aliasName: this.state.aliasName,
      publicValue: this.state.publicValue,
      acceptTransferFlags: this.state.acceptTransferFlags,
      expireTimestamp: this.state.expireTimestamp,
      address: this.state.address,
      encryptionPrivKey: this.state.encryptionPrivKey,
      encryptionPublicKey: this.state.encryptionPublicKey,
      witness: this.state.witness,
      block: this.props.currentBlock,
      round: 0
    }, (err) => {
      this.setState({
        isLoading: false
      })
      if (err) {
        return swal('Error', parseError(err.message), 'error')
      }

      swal('Success', 'Alias created. It will be available in 2 blocks.', 'success')
      this.cleanForm()
    })
  }

  render() {
    return (
      <div className='create-alias-container'>
        <h3 className='create-alias-title'>{this.props.title}</h3>
        <div className='create-alias-unfinished-aliases'>
          {this.generateUnfinishedAliases()}
        </div>
        <div className='create-alias-form-container'>
          <Input
            name='aliasName'
            placeholder='New alias name'
            onChange={e => this.updateField(e, 'aliasName')}
            value={this.state.aliasName}
            className='create-alias-control create-alias-form-name'
          />
          <Input
            name='publicValue'
            placeholder='Public Value'
            onChange={e => this.updateField(e, 'publicValue')}
            value={this.state.publicValue}
            className='create-alias-control create-alias-form-publicvalue'
          />
          <Select
            name='acceptTransferFlags'
            placeholder='Accept Transfer Flag'
            onChange={e => this.updateField(e, 'acceptTransferFlags')}
            value={this.state.acceptTransferFlags === -1 ? undefined : this.state.acceptTransferFlags}
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
            onChange={e => this.updateField(e, 'expireTimestamp')}
            value={this.state.expireTimestamp}
            className='create-alias-control create-alias-form-timestamp'
          />
          <Input
            name='address'
            placeholder='Address'
            onChange={e => this.updateField(e, 'address')}
            value={this.state.address}
            className='create-alias-control create-alias-form-address'
          />
          <Input
            name='encryptionPrivKey'
            placeholder='Encryption Private Key'
            onChange={e => this.updateField(e, 'encryptionPrivKey')}
            value={this.state.encryptionPrivKey}
            className='create-alias-control create-alias-form-privkey'
          />
          <Input
            name='encryptionPublicKey'
            placeholder='Encryption Public Key'
            onChange={e => this.updateField(e, 'encryptionPublicKey')}
            value={this.state.encryptionPublicKey}
            className='create-alias-control create-alias-form-pubkey'
          />
          <Input
            name='witness'
            placeholder='Witness'
            onChange={e => this.updateField(e, 'witness')}
            value={this.state.witness}
            className='create-alias-control create-alias-form-witness'
          />
          <div className='create-alias-form-btn-container'>
            <Button
              disabled={
                !this.state.aliasName ||
                !this.state.acceptTransferFlags ||
                this.state.isLoading
              }
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
