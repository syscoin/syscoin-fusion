// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import startUpRoutine from '../utils/startup';

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
    super(props);

    startUpRoutine(props.dispatch);
  }

  render() {
    return <Home startUp={this.props.startUp} />;
  }
}

const mapStateToProps = state => ({
  startUp: state.startUp
});

export default connect(mapStateToProps)(HomePage);
