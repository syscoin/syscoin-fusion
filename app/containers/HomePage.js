// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import swal from 'sweetalert'
import Home from '../components/Home'
import startUpRoutine from '../utils/startup'
import getSysPath from '../utils/syspath'

type Props = {
  startUp: {
    success: boolean | null,
    error: boolean | null,
    shouldReload: boolean
  },
  dispatch: Function
};

class HomePage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    swal({
      title: 'What Syscoin files do you want to use?',
      text: `Default (${getSysPath('default')}) or Local (generated inside SYS-WALLET directory)?`,
      icon: 'info',
      closeOnEsc: false,
      closeOnClickOutside: false,
      buttons: [
        {
          text: 'Default',
          value: 'default',
          visible: true,
          closeModal: true
        },
        {
          text: 'Local',
          value: 'local',
          visible: true,
          closeModal: true
        }
      ]
    }).then(val => startUpRoutine(props.dispatch, val)).catch((err) => console.log(err))
  }

  render() {
    return <Home startUp={this.props.startUp} />
  }
}

const mapStateToProps = state => ({
  startUp: state.startUp
})

export default connect(mapStateToProps)(HomePage)
