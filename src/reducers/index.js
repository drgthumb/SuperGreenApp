import { fromJS } from 'immutable';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux-immutable'
import immutableTransform from 'redux-persist-transform-immutable'

export const persistConfig = {
  transforms: [immutableTransform()],
  key: 'persist',
  storage,
}

import ble from './ble'

const AppReducer = combineReducers({
  ble,
})

export default AppReducer
