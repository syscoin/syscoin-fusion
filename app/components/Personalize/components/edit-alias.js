// @flow
import React, { Component } from 'react'
import { Input, Button, Select, Spin, Icon, Tooltip } from 'antd'
import swal from 'sweetalert'
import formChangeFormat from 'fw-utils/form-change-format'
import parseError from 'fw-utils/error-parser'

const { Option } = Select

type Props = {
  aliasInfo: Function,
  currentAliases: Array<Object>,
  editAlias: Function
};
type State = {
  isLoading: boolean,
  aliasToEdit: string,
  editValues: Object
};

export default class NewAlias extends Component<Props, State> {
  props: Props;

  constructor(props: Object) {
    super(props)

    this.state = {
      isLoading: false,
      aliasToEdit: '',
      editValues: {
        publicValue: '',
        address: '',
        acceptTransferFlag: 3,
        expireTimestamp: 1548184538,
        encPrivKey: '',
        encPubKey: '',
        witness: ''
      }
    }
  }

  updateFields(value: string | Object, name: string, filter?: RegExp) {
    const toUpdate = formChangeFormat(value, name)

    if (filter && !filter.test(toUpdate[name])) {
      if (toUpdate[name]) {
        return
      }
    }

    this.setState({
      editValues: {
        ...this.state.editValues,
        ...toUpdate
      }
    })
  }

  selectAlias(name: string) {

    this.setState({
      isLoading: true,
      aliasToEdit: ''
    }, async () => {

      let data

      try {
        data = await this.props.aliasInfo(name)
      } catch (err) {
        this.setState({ isLoading: false })
        return swal('Error', parseError(err.message), 'error')
      }

      const newValues = { ...this.state.editValues }

      newValues.publicValue = data.publicvalue
      newValues.address = data.address
      newValues.encPrivKey = data.encryption_privatekey
      newValues.encPubKey = data.encryption_publickey
      newValues.acceptTransferFlag = data.accepttransferflags
      newValues.expireTimestamp = data.expires_on

      this.setState({
        isLoading: false,
        aliasToEdit: name,
        editValues: newValues
      })
    })
  }

  updateAlias() {
    this.setState({
      isLoading: true
    }, async () => {
      const obj = {
        aliasName: this.state.aliasToEdit,
        publicValue: this.state.editValues.publicValue,
        address: this.state.editValues.address,
        acceptTransfersFlag: this.state.editValues.acceptTransferFlag,
        expireTimestamp: this.state.editValues.expireTimestamp.toString(),
        encPrivKey: this.state.editValues.encPrivKey,
        encPubKey: this.state.editValues.encPubKey,
        witness: this.state.editValues.witness
      }

      try {
        await this.props.editAlias(obj)
      } catch (err) {
        console.log(err)
        this.setState({ isLoading: false })
        return swal('Error', parseError(err.message), 'error')
      }

      swal('Success', 'Alias updated. The changes will take effect in a few blocks.', 'success')

      this.setState({
        isLoading: false,
        aliasToEdit: ''
      })
    })
  }

  render() {
    const { isLoading } = this.state
    return (
      <div className='edit-alias-container'>
        <h3 className='edit-alias-title'>Edit alias</h3>
        <div className='edit-alias-form-container'>
          <Select
            disabled={isLoading}
            placeholder='Alias'
            onChange={this.selectAlias.bind(this)}
            value={this.state.aliasToEdit}
            className='edit-alias-form-control edit-alias-form-alias'
          >
            {this.props.currentAliases.filter(i => i.alias).map(i => <Option value={i.alias} key={i.alias}>{i.alias}</Option>)}
          </Select>
          {(isLoading && !this.state.aliasToEdit) && <Spin indicator={<Icon className='personalize-loader' type='loading' spin />} />}
          {this.state.aliasToEdit && (
            <div>
              <h3 className='edit-alias-form-active-alias'>Editing alias <span className='editing-alias'>{this.state.aliasToEdit}</span></h3>
              <Tooltip trigger={['focus']} title='Max 256 characters.' placement='right'>
                <Input
                  disabled={isLoading}
                  name='publicValue'
                  placeholder='Public Value'
                  onChange={e => this.updateFields(e, 'publicValue', /^(\d|\w|\W){0,256}$/)}
                  value={this.state.editValues.publicValue}
                  className='edit-alias-form-control edit-alias-form-publicvalue'
                />
              </Tooltip>
              <Tooltip trigger={['focus']} title='Defaults to 3.' placement='right'>
                <Select
                  disabled={isLoading}
                  name='acceptTransferFlag'
                  placeholder='Accept Transfer Flag'
                  onChange={val => this.updateFields(val, 'acceptTransferFlag')}
                  value={this.state.editValues.acceptTransferFlag}
                  className='edit-alias-form-control edit-alias-form-transferflag'
                >
                  <Option value={0}>0 - None</Option>
                  <Option value={1}>1 - Accepting certificate transfers</Option>
                  <Option value={2}>2 - Accepting asset transfers</Option>
                  <Option value={3}>3 - All</Option>
                </Select>
              </Tooltip>
              <Tooltip trigger={['focus']} title='Unix epoch time in seconds for when to expire the alias. It is exponentially more expensive per year, calculation is FEERATE*(2.88^years). FEERATE is the dynamic based on the size of the transaction and what the minimum fee rate is currently which depends on how congested the network is. Defaults to 1548184538.' placement='right'>
                <Input
                  disabled={isLoading}
                  name='expireTimestamp'
                  placeholder='Expire timestamp'
                  onChange={val => this.updateFields(val, 'expireTimestamp', /^\d+$/)}
                  value={this.state.editValues.expireTimestamp}
                  className='edit-alias-form-control edit-alias-form-timestamp'
                />
              </Tooltip>
              <Tooltip trigger={['focus']} title='Address for this alias.' placement='right'>
                <Input
                  disabled={isLoading}
                  name='address'
                  placeholder='Address'
                  onChange={val => this.updateFields(val, 'address', /^(\d|\w){0,36}$/)}
                  value={this.state.editValues.address}
                  className='edit-alias-form-control edit-alias-form-address'
                  maxLength='34'
                />
              </Tooltip>
              <Tooltip trigger={['focus']} title='Encrypted private key used for encryption/decryption of private data related to this alias. Should be encrypted to publickey.' placement='right'>
                <Input
                  disabled={isLoading}
                  name='encPrivKey'
                  placeholder='Encryption Private Key'
                  onChange={val => this.updateFields(val, 'encPrivKey')}
                  value={this.state.editValues.encPrivKey}
                  className='edit-alias-form-control edit-alias-form-privkey'
                />
              </Tooltip>
              <Tooltip trigger={['focus']} title='Public key used for encryption/decryption of private data related to this alias.' placement='right'>
                <Input
                  disabled={isLoading}
                  name='encPubKey'
                  placeholder='Encryption Public Key'
                  onChange={val => this.updateFields(val, 'encPubKey')}
                  value={this.state.editValues.encPubKey}
                  className='edit-alias-form-control edit-alias-form-pubkey'
                />
              </Tooltip>
              <Tooltip trigger={['focus']} title='Witness alias name that will sign for web-of-trust notarization of this transaction.' placement='right'>
                <Input
                  disabled={isLoading}
                  name='witness'
                  placeholder='Witness'
                  onChange={val => this.updateFields(val, 'witness')}
                  value={this.state.editValues.witness}
                  className='edit-alias-form-control edit-alias-form-witness'
                />
              </Tooltip>
            </div>
          )}

          {this.state.aliasToEdit && (
            <div className='edit-alias-form-btn-container'>
              <Button
                className='edit-alias-form-btn-send'
                disabled={isLoading}
                onClick={this.updateAlias.bind(this)}
                loading={isLoading}
              >
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
