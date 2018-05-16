import { fromJS } from 'immutable';
import { Types } from '../actions/ble';

const initialState = fromJS({
  devices: {},
  error: null,
})

// TODO remove mapping function name->uuid
function ble(state = initialState, action) {
  let nextState
  switch (action.type) {
    case Types.DEVICE_DISCOVERED:
      nextState = state.setIn(['devices', action.device.get('id')], action.device)
      break
    case Types.CHARACTERISTIC_CHANGED:
    case Types.SET_CHARACTERISTIC_VALUE:
      nextState = state.setIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName, 'value'], action.value)
      break
    case Types.ERROR:
      if (action.deviceId) {
        nextState = state.setIn(['devices', action.deviceId, 'error'], action.error)
      } else {
        nextState = state.set('error', action.error)
      }
      break
    default:
      break
  }

  return nextState || state
}

export default ble
