import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable'

import ble from './ble'

const AppReducer = combineReducers({
  ble,
})

export default AppReducer
