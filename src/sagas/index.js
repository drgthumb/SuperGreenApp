import { bleSaga } from './ble'
import { fork } from 'redux-saga/effects'

const rootSaga = function*() {
  yield fork(bleSaga)
}

export { 
  rootSaga,
}
