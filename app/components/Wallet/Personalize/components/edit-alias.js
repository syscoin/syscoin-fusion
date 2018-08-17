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
  isLoading: boolean
};

export default class NewAlias extends Component<Props, State> {
  props: Props;

  constructor(props) {
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

  updateFields(e) {
    const { name, value } = e.target
    const newState = { ...this.state }

    newState.editValues[name] = value

    this.setState(newState)
  }

  selectAlias(name) {

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

      swal('Success', 'Alias updated', 'success')

      this.setState({
        isLoading: false,
        aliasToEdit: ''
      })
    })
  }

  render() {
    return (
      <div className='create-alias'>
        <h3 className='white-text'>Edit an alias</h3>
        <Select
          placeholder='Alias'
          onChange={this.selectAlias.bind(this)}
          style={{ width: '100%' }}
          value={this.state.aliasToEdit}
        >
          {this.props.currentAliases.filter(i => i.alias).map(i => <Option value={i.alias} key={i.alias}>{i.alias}</Option>)}
        </Select>
        {this.state.aliasToEdit && (
          <div>
            <h3>Editing alias {this.state.aliasToEdit}</h3>
            <Input
              name='publicValue'
              placeholder='Public Value'
              onChange={this.updateFields.bind(this)}
              value={this.state.editValues.publicValue}
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
            />
            <Input
              name='address'
              placeholder='Address'
              onChange={this.updateFields.bind(this)}
              value={this.state.editValues.address}
            />
            <Input
              name='encPrivKey'
              placeholder='Encryption Private Key'
              onChange={this.updateFields.bind(this)}
              value={this.state.editValues.encPrivKey}
            />
            <Input
              name='encPubKey'
              placeholder='Encryption Public Key'
              onChange={this.updateFields.bind(this)}
              value={this.state.editValues.encPubKey}
            />
            <Input
              name='witness'
              placeholder='Witness'
              onChange={this.updateFields.bind(this)}
              value={this.state.editValues.witness}
            />
          </div>
        )}

        {this.state.aliasToEdit && (
          <div style={{ textAlign: 'right', padding: '10px 0 10px 0' }}>
            <Button disabled={this.state.isLoading} onClick={this.updateAlias.bind(this)}>
              Send
            </Button>
          </div>
        )}
      </div>
    )
  }
}
