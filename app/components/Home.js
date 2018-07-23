// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.css'

type Props = {
  startUp: {
    success: boolean | null,
    error: boolean | null,
    shouldReload: boolean
  }
};

type startUpType = {
  success: boolean | null,
  error: boolean | null,
  shouldReload: boolean
};

export default class Home extends Component<Props> {
  props: Props;

  mainText(startUp: startUpType) {
    if (startUp.success) {
      return <h2>Successfully connected to Syscoind.exe</h2>
    }

    if (startUp.error) {
      if (startUp.shouldReload) {
        return (
          <h2>
            Something might be going wrong. Retrying connection to Syscoind.exe
          </h2>
        )
      }
      return <h2>Something went wrong! Retrying...</h2>
    }

    return <h2>Loading...</h2>
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          {this.mainText(this.props.startUp)}
          <Link to="/wallet">to Wallet</Link>
        </div>
      </div>
    )
  }
}
