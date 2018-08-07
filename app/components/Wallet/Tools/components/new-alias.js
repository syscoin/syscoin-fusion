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

  generateUnfinishedAliases() {
    return (
      <ul>
        Unfinished aliases:
        {this.props.getUnfinishedAliases().map(i => (
          <li>{i.alias}</li>
        ))}
      </ul>
    )
  }

  createNewAlias() {
    this.props.createNewAlias({
      aliasName: this.props.aliasName
    }, (err, result) => {
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
        <div>
          {this.generateUnfinishedAliases()}
        </div>
        <Input
          name='aliasName'
          placeholder='New alias name'
          onChange={e => this.props.updateFields(e, 'newAlias')}
          value={this.props.aliasName}
        />
        <Button
          disabled={!this.props.aliasName}
          onClick={this.createNewAlias.bind(this)}
        >
          Send
        </Button>
      </div>
    )
  }
}
