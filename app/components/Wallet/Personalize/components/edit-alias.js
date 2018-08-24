// @flow
import React, { Component } from 'react'
import { Input, Button, Select } from 'antd'
import swal from 'sweetalert'

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

  updateFields(e: Object) {
    const { name, value } = e.target
    const newState = { ...this.state }

    newState.editValues[name] = value

    this.setState(newState)
  }

  selectAlias(name: string) {

    this.setState({
      isLoading: true,
      aliasToEdit: ''
    }, () => {
      this.props.aliasInfo(name, (err, data) => {
        if (err) {
          this.setState({ isLoading: false })
          swal('Error', 'Error while getting alias info', 'error')
          return
        }

        console.log(data)

        const newValues = {...this.state.editValues}

        newValues.publicValue = data.publicvalue
        newValues.address = data.address
        newValues.encPrivKey = data.encryption_privatekey
        newValues.encPubKey= data.encryption_publickey
        newValues.acceptTransferFlag = data.accepttransferflags
        newValues.expireTimestamp = data.expires_on

        this.setState({
          isLoading: false,
          aliasToEdit: name,
          editValues: newValues
        })
      })
    })
  }

  updateAlias() {
    this.setState({
      isLoading: true
    })
    const obj = {
      aliasName: this.state.aliasToEdit,
      publicValue: this.state.editValues.publicValue,
      address: this.state.editValues.address,
      acceptTransfersFlag: this.state.editValues.acceptTransferFlag,
      expireTimestamp: this.state.editValues.expireTimestamp,
      encPrivKey: this.state.editValues.encPrivKey,
      encPubKey: this.state.editValues.encPubKey,
      witness: this.state.editValues.witness
    }

    this.props.editAlias(obj, err => {
      if (err) {
        this.setState({
          isLoading: false
        })
        swal('Error', 'Error while updating alias.', 'error')
        return
      }

      swal('Success', 'Alias updated. The changes will take effect in a few blocks.', 'success')

      this.setState({
        isLoading: false,
        aliasToEdit: ''
      })
    })
  }

  render() {
    return (
      <div className='edit-alias-container'>
        <h3 className='edit-alias-title'>Edit an alias</h3>
        <div className='edit-alias-form-container'>
          <Select
            placeholder='Alias'
            onChange={this.selectAlias.bind(this)}
            style={{ width: '100%' }}
            value={this.state.aliasToEdit}
            className='edit-alias-form-control edit-alias-form-alias'
          >
            {this.props.currentAliases.filter(i => i.alias).map(i => <Option value={i.alias} key={i.alias}>{i.alias}</Option>)}
          </Select>
          {this.state.aliasToEdit && (
            <div>
              <h3 className='edit-alias-form-active-alias'>Editing alias {this.state.aliasToEdit}</h3>
              <Input
                name='publicValue'
                placeholder='Public Value'
                onChange={this.updateFields.bind(this)}
                value={this.state.editValues.publicValue}
                className='edit-alias-form-control edit-alias-form-publicvalue'
              />
              <Select
                name='acceptTransferFlag'
                placeholder='Accept Transfer Flag'
                onChange={val => this.updateFields({
                  target: {
                    value: val,
                    name: 'acceptTransferFlag'
                  }
                })}
                style={{ width: '100%' }}
                value={this.state.editValues.acceptTransferFlag}
                className='edit-alias-form-control edit-alias-form-transferflag'
              >
                <Option value={0}>0 - None</Option>
                <Option value={1}>1 - Accepting certificate transfers</Option>
                <Option value={2}>2 - Accepting asset transfers</Option>
                <Option value={3}>3 - All</Option>
              </Select>
              <Input
                name='expireTimestamp'
                placeholder='Expire timestamp'
                onChange={this.updateFields.bind(this)}
                value={this.state.editValues.expireTimestamp}
                className='edit-alias-form-control edit-alias-form-timestamp'
              />
              <Input
                name='address'
                placeholder='Address'
                onChange={this.updateFields.bind(this)}
                value={this.state.editValues.address}
                className='edit-alias-form-control edit-alias-form-address'
              />
              <Input
                name='encPrivKey'
                placeholder='Encryption Private Key'
                onChange={this.updateFields.bind(this)}
                value={this.state.editValues.encPrivKey}
                className='edit-alias-form-control edit-alias-form-privkey'
              />
              <Input
                name='encPubKey'
                placeholder='Encryption Public Key'
                onChange={this.updateFields.bind(this)}
                value={this.state.editValues.encPubKey}
                className='edit-alias-form-control edit-alias-form-pubkey'
              />
              <Input
                name='witness'
                placeholder='Witness'
                onChange={this.updateFields.bind(this)}
                value={this.state.editValues.witness}
                className='edit-alias-form-control edit-alias-form-witness'
              />
            </div>
          )}

          {this.state.aliasToEdit && (
            <div className='edit-alias-form-btn-container' style={{ textAlign: 'right', padding: '10px 0 10px 0' }}>
              <Button className='edit-alias-form-btn-send' disabled={this.state.isLoading} onClick={this.updateAlias.bind(this)}>
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
