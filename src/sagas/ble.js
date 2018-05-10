import { fromJS } from 'immutable'
import { call, take, takeEvery, put } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import { Creators, Types } from '../actions/ble';
import { init, listenDevices, setCharacteristicValue } from '../utils/ble'

const devicesFoundEventChannel = () => 
  eventChannel(emitter => 
    listenDevices(
      (device) => emitter(Creators.deviceDiscovered(fromJS(device))),
      (d, s, c, v) => emitter(Creators.characteristicChanged(d, s, c, v)),
      (deviceName, error) => emitter(Creators.error(deviceName, fromJS(error))),
    )
  )

const scan = function*(action) {
  yield call(setCharacteristicValue, action.deviceName, 'wifi', 'scanWifi', 'ON')
}

const bleSaga = function*() {
  yield takeEvery(Types.SCAN, scan);
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
