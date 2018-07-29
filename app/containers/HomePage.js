// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'
import swal from 'sweetalert'
import waterfall from 'async/waterfall'
import Home from '../components/Home'
import startUpRoutine from '../utils/startup'
import getSysPath from '../utils/syspath'
import detectQtRunning from '../utils/detect-qt-running'
import killPid from '../utils/close-pid'

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
  }

  componentWillMount() {
    waterfall([
      cb => {
        if (detectQtRunning()) {
          swal({
            title: 'SyscoinQT is running',
            text: 'Please close it before attempting to run SYS-WALLET',
            icon: 'warning',
            closeOnEsc: false,
            closeOnClickOutside: false,
            buttons: [
              {
                text: 'Close QT',
                value: 'close-qt',
                visible: true,
                closeModal: true
              },
              {
                text: 'Exit',
                value: 'exit',
                visible: true,
                closeModal: true
              }
            ]
          }).then(val => {
            if (val === 'close-qt') {
              killPid(detectQtRunning(true))
            } else {
              remote.getCurrentWindow().close()
            }

            cb()
          }).catch((err) => cb(err))
        } else {
          cb()
        }
      }
    ], (err, val) => {
      if (err) {
        return console.log(err)
      }
      startUpRoutine(this.props.dispatch, 'default')
    })
  }

  render() {
    return <Home startUp={this.props.startUp} />
  }
}

const mapStateToProps = state => ({
  startUp: state.startUp
})

export default connect(mapStateToProps)(HomePage)
