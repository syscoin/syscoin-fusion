/* eslint import/first:0 */

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Console from './containers/Console'
import { store, history } from './store/configureStore'
import pushToLogs from 'fw-utils/push-to-logs'
import './app.global.scss'

import 'fw-utils/i18n'

// Log all errors to debug.log
window.onerror = err => pushToLogs(err)

render(
  <AppContainer>
    <Console store={store} history={history} />
  </AppContainer>,
  document.getElementById('console-root')
)
