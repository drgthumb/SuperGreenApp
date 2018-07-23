import { fromJS } from 'immutable'
import { call, take, takeEvery, put } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import { Creators, Types } from '../actions/ble'
import { init, listenDevices, readCharacterisitcValue, setCharacteristicValue } from '../utils/ble'

const bluetoothEventChannel = () => 
  eventChannel(emitter => 
    setBluetoothEventEmitter(emitter)
  )

const bluetoothEventChannelSaga = function*() {
  const chan = yield call(bluetoothEventChannel)

  try {
    while (true) {
      const evt = yield take(chan)
      yield put(evt)
    }
  } catch(e) {
    console.log(e)
  }
}

const setCharacteristicValueSaga = function*(action) {
  yield call(setCharacteristicValue, action.deviceId, action.serviceName, action.characteristicName, action.value)
}

const getCharacteristicValueSaga = function*(action) {
  console.log('getCharacterisitcValue', action)
  yield call(getCharacteristicValue, action.deviceId, action.serviceName, action.characteristicName)
}

const bleSaga = function*() {
  yield takeEvery(Types.SET_CHARACTERISTIC_VALUE, setCharacteristicValueSaga)
  yield takeEvery(Types.GET_CHARACTERISTIC_VALUE, getCharacteristicValueSaga)
  yield call(bluetoothEventChannelSaga)
  yield call(startBluetoothStack)
}

export {
  bleSaga,
}
