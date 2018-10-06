// @flow
import React, { Component } from 'react'
import { Input, Button, Select, Tag, Tooltip } from 'antd'
import swal from 'sweetalert'
import formChangeFormat from 'fw-utils/form-change-format'
import parseError from 'fw-utils/error-parser'
import QueuedAlias from './queued-alias'

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

    this.state = { ...this.initialState }
  }

  updateField(value: string | Object, name: string, filter: RegExp) {
    const toUpdate = formChangeFormat(value, name)

    if (filter && !filter.test(toUpdate[name])) {
      if (toUpdate[name]) {
        return
      }
    }

    this.setState(toUpdate)
  }

  cleanForm() {
    this.setState({ ...this.initialState })
  }

  generateUnfinishedAliases() {
    const { unfinishedAliases } = this.props
    return unfinishedAliases.length ? (
      <ul className='create-alias-unfinished-aliases-ul'>
        {<span className='create-alias-unfinished-aliases-text'>Unfinished aliases:</span>}
        {unfinishedAliases.map(i => (
          <li key={i.aliasName} className='create-alias-unfinished-aliases-li'>
            <QueuedAlias
              aliasName={i.aliasName}
              error={i.error}
            />
          </li>
        ))}
      </ul>
    ) : []
  }

  createNewAlias() {
    this.setState({
      isLoading: true
    })
    this.props.createNewAlias({
      aliasName: this.state.aliasName.trim(),
      publicValue: this.state.publicValue,
      acceptTransferFlags: this.state.acceptTransferFlags,
      expireTimestamp: this.state.expireTimestamp === -1 ? 3 : this.state.expireTimestamp,
      address: this.state.address,
      encryptionPrivKey: this.state.encryptionPrivKey,
      encryptionPublicKey: this.state.encryptionPublicKey,
      witness: this.state.witness,
      block: this.props.currentBlock,
      round: 0,
      error: null
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

  checkCorrectFormat() {
    const {
      aliasName,
      expireTimestamp,
      address,
      encryptionPrivKey,
      encryptionPublicKey,
      witness
    } = this.state
    let isCorrect = true

    if (aliasName.length < 3 || aliasName.length > 64 || aliasName[0] === '-' || aliasName.trim() !== aliasName) {
      isCorrect = false
    }



    return isCorrect
  }

  render() {
    return (
      <div className='create-alias-container'>
        <h3 className='create-alias-title'>{this.props.title}</h3>
        <div className='create-alias-unfinished-aliases'>
          {this.generateUnfinishedAliases()}
        </div>
        <div className='create-alias-form-container'>
          <p className='create-alias-form-required-fields'>Only alias name field is required, the rest is optional.</p>
          <Tooltip trigger={['focus']} title='3 to 64 characters long. No preceding or trailing dashes' placement='right'>
            <Input
              name='aliasName'
              placeholder='New alias name'
              onChange={e => this.updateField(e, 'aliasName', /^(\d|\w|\W){0,36}$/)}
              value={this.state.aliasName}
              className='create-alias-control create-alias-form-name'
              maxLength='64'
            />
          </Tooltip>
          <Tooltip trigger={['focus']} title='Max 256 characters.' placement='right'>
            <Input
              name='publicValue'
              placeholder='Public Value'
              onChange={e => this.updateField(e, 'publicValue', /^(\d|\w|\W){0,256}$/)}
              value={this.state.publicValue}
              className='create-alias-control create-alias-form-publicvalue'
            />
          </Tooltip>
          <Tooltip trigger={['focus']} title='Defaults to 3.' placement='right'>
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
          </Tooltip>
          <Tooltip trigger={['focus']} title='Unix epoch time in seconds for when to expire the alias. It is exponentially more expensive per year, calculation is FEERATE*(2.88^years). FEERATE is the dynamic based on the size of the transaction and what the minimum fee rate is currently which depends on how congested the network is. Defaults to 1548184538.' placement='right'>
            <Input
              name='expireTimestamp'
              placeholder='Expire timestamp'
              onChange={e => this.updateField(e, 'expireTimestamp', /^\d+$/)}
              value={this.state.expireTimestamp}
              className='create-alias-control create-alias-form-timestamp'
            />
          </Tooltip>
          <Tooltip trigger={['focus']} title='Address for this alias.' placement='right'>
            <Input
              name='address'
              placeholder='Address'
              onChange={e => this.updateField(e, 'address', /^(\d|\w){0,36}$/)}
              value={this.state.address}
              className='create-alias-control create-alias-form-address'
            />
          </Tooltip>
          <Tooltip trigger={['focus']} title='Encrypted private key used for encryption/decryption of private data related to this alias. Should be encrypted to publickey.' placement='right'>
            <Input
              name='encryptionPrivKey'
              placeholder='Encryption Private Key'
              onChange={e => this.updateField(e, 'encryptionPrivKey')}
              value={this.state.encryptionPrivKey}
              className='create-alias-control create-alias-form-privkey'
            />
          </Tooltip>
          <Tooltip trigger={['focus']} title='Public key used for encryption/decryption of private data related to this alias.' placement='right'>
            <Input
              name='encryptionPublicKey'
              placeholder='Encryption Public Key'
              onChange={e => this.updateField(e, 'encryptionPublicKey')}
              value={this.state.encryptionPublicKey}
              className='create-alias-control create-alias-form-pubkey'
            />
          </Tooltip>
          <Tooltip trigger={['focus']} title='Witness alias name that will sign for web-of-trust notarization of this transaction.' placement='right'>
            <Input
              name='witness'
              placeholder='Witness'
              onChange={e => this.updateField(e, 'witness')}
              value={this.state.witness}
              className='create-alias-control create-alias-form-witness'
            />
          </Tooltip>
          <div className='create-alias-form-btn-container'>
            <Button
              disabled={
                !this.state.aliasName ||
                !this.state.acceptTransferFlags ||
                this.state.isLoading ||
                !this.checkCorrectFormat()
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
