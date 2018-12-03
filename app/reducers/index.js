// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import wallet from './wallet'
import options from './options'
import forms from './forms'
import console from './console'

const rootReducer = combineReducers({
  router,
  wallet,
  options,
  forms,
  console
})

export default rootReducer
