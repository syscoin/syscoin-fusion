// @flow
import React, { Component } from 'react'
import { Button } from 'antd'
import swal from 'sweetalert'

type Props = {
  getPrivateKey: Function
};
type State = {
  isLoading: boolean
};

export default class GetPrivateKey extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false
    }
  }

  getKey() {
    this.setState({
      isLoading: true
    })
    this.props.getPrivateKey((err, key) => {
      this.setState({
        isLoading: false
      })
      if (err) {
        return swal('Error', err, 'error')
      }

      return swal('Here is your key', key, 'success')
    })
  }

  render() {
    return (
      <div className='get-priv-key-container'>
        <h3 className='get-priv-key-title'>Get Private Key</h3>
        <Button className='get-priv-key-btn' disabled={this.state.isLoading} onClick={this.getKey.bind(this)}>Get Private Key</Button>
      </div>
    )
  }
}
