// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import startUp from './startup';

const rootReducer = combineReducers({
  counter,
  router,
  startUp
});

export default rootReducer;
