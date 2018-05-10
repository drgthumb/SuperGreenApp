import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable'
import { createStore } from 'redux'

import nav from './nav'
import ble from './ble'

const AppReducer = combineReducers({
  ble,
  nav,
})

export default AppReducer
