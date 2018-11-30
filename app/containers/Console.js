// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

type Props = {
};

class Console extends Component<Props> {
  render() {
    return (
      <div style={{
        height: 500,
        width: 500,
        background: 'red'
      }}
      />
    )
  }
}

const mapStateToProps = state => ({
  
})

const mapDispatchToProps = dispatch => bindActionCreators({
  
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Console)
