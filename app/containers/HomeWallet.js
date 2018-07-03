// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wallet from '../components/Wallet/Main';

type Props = {};

class WalletHome extends Component<Props> {
  props: Props;

  render() {
    return <Wallet />;
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(WalletHome);
