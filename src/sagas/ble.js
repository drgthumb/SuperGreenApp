import { fromJS } from 'immutable'
import { call, take, takeEvery, put } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import { Creators, Types } from '../actions/ble';
import { init, listenDevices, readCharacterisitcValue, setCharacteristicValue } from '../utils/ble'

const devicesFoundEventChannel = () => 
  eventChannel(emitter => 
    listenDevices(
      (device) => emitter(Creators.deviceDiscovered(fromJS(device))),
      (d, s, c, v) => emitter(Creators.characteristicChanged(d, s, c, v)),
      (deviceId, error) => emitter(Creators.error(deviceId, fromJS(error))),
    )
  )

const setCharacteristicValueSaga = function*(action) {
  yield call(setCharacteristicValue, action.deviceId, action.serviceName, action.characteristicName, action.value)
}

const readCharacterisitcValueSaga = function(action) {
  console.log('readCharacterisitcValue', action);
}

const bleSaga = function*() {
  yield takeEvery(Types.SET_CHARACTERISTIC_VALUE, setCharacteristicValueSaga);
  yield takeEvery(Types.READ_CHARACTERISTIC_VALUE, readCharacteristicValueSaga);
  yield call(init)
  const chan = yield call(devicesFoundEventChannel)

  try {
    while (true) {
      const evt = yield take(chan)
      yield put(evt)
    }
  } catch(e) {
    console.log(e)
  }
}

export {
  bleSaga,
}
