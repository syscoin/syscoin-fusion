// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import startUp from './startup'
import options from './options'

const rootReducer = combineReducers({
  router,
  startUp,
  options
})

export default rootReducer
