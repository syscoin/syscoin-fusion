// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import wallet from './wallet'
import options from './options'

const rootReducer = combineReducers({
  router,
  wallet,
  options
})

export default rootReducer
