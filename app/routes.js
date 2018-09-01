/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './containers/App'
import HomeWallet from './containers/HomeWallet'

export default () => (
  <App>
    <Switch>
      <Route path="/" component={HomeWallet} />
    </Switch>
  </App>
)
