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
      nextState = state.setIn(['devices', action.device.get('name')], action.device)
      break
    case Types.CHARACTERISTIC_CHANGED:
      if (action.characteristicName == 'foundWifi') {
        nextState = state.updateIn(['devices', action.deviceName, 'services', action.serviceName, 'characteristics', action.characteristicName, 'value'], (arr) => (arr || []).push(action.value))
      } else {
        nextState = state.setIn(['devices', action.deviceName, 'services', action.serviceName, 'characteristics', action.characteristicName, 'value'], action.value)
      }
      break
    case Types.SCAN:
      nextState = state.setIn(['devices', action.deviceName, 'services', 'wifi', 'characteristics', 'foundWifi', 'value'], fromJS([]))
    case Types.ERROR:
      if (action.deviceName) {
        nextState = state.setIn(['devices', action.deviceName, 'error'], action.error)
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
