/* eslint import/first:0 */

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Console from './containers/Console'
import { store, history } from './store/configureStore'
import './app.global.scss'

render(
  <AppContainer>
    <Console store={store} history={history} />
  </AppContainer>,
  document.getElementById('console-root')
)
