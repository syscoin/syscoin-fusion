// @flow
import React, { Component } from 'react'
import { Input, Button } from 'antd'
import swal from 'sweetalert'

type Props = {
  createNewAlias: Function,
  getUnfinishedAliases: Function,
  pushNewAlias: Function,
  removeFinishedAlias: Function,
  aliasName: string,
  updateFields: Function
};

export default class NewAlias extends Component<Props> {
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
      aliasName: this.props.aliasName
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
      <div>
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
