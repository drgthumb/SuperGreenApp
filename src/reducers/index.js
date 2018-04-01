import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable'
import { createStore } from 'redux'

import nav from '../reducers/nav'
import ble from '../reducers/ble'

const AppReducer = combineReducers({
  ble,
  nav,
})

export default AppReducer
