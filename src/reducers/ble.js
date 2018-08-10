import { fromJS } from 'immutable';
import { Types } from '../actions/ble';

const initialState = fromJS({
  ready: false,
  devices: {},
  error: null,
})

// TODO remove mapping function name->uuid
function ble(state = initialState, action) {
  let nextState
  switch (action.type) {

    // Setting characteristic value

    case Types.SETTING_CHARACTERISTIC_VALUE:
      nextState = state.setIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName, 'setting'], true)
      break
    case Types.CHARACTERISTIC_VALUE_SET:
      nextState = state.updateIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName], (v) => v.set('value', action.value).delete('setting'))
      break
    case Types.SET_CHARACTERISTIC_VALUE_ERROR:
      nextState = state.setIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName, 'set_value_error'], action.error)
      break

    // Getting characteristic value

    case Types.GETTING_CHARACTERISTIC_VALUE:
      nextState = state.setIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName, 'getting'], true)
      break
    case Types.GOT_CHARACTERISTIC_VALUE:
      nextState = state.updateIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName], (v) => v.set('value', action.value).set('loaded', true).delete('getting'))
      break
    case Types.GET_CHARACTERISTIC_VALUE_ERROR:
      nextState = state.setIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName, 'get_value_error'], action.error)
      break

    // Monitoring stuffs

    case Types.CHARACTERISTIC_VALUE_CHANGED:
      nextState = state.setIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName, 'value'], action.value)
      break
    case Types.MONITORING_ERROR:
      nextState = state.setIn(['devices', action.deviceId, 'services', action.serviceName, 'characteristics', action.characteristicName, 'monitoring_error'], action.error)
      break

    // Discovering stuffs

    case Types.DEVICE_DISCOVERED:
      nextState = state.setIn(['devices', action.device.get('id')], action.device)
      break
    case Types.DEVICE_DISCOVER_ERROR:
      nextState = state.set('discover_error', action.error)
      break

    // Connection stuffs

    case Types.DEVICE_CONNECTED:
      nextState = state.updateIn(['devices', action.deviceId], (d) => d.set('connected', true).set('connecting', false))
      break
    case Types.DEVICE_CONNECTING:
      nextState = state.setIn(['devices', action.deviceId, 'connecting'], true)
      break
    case Types.DEVICE_CONNECTION_ERROR:
      nextState = state.updateIn(['devices', action.deviceId], (d) => d.set('connection_error', action.error).set('connecting', false))
      break
    case Types.DEVICE_DISCONNECTED:
      nextState = state.updateIn(['devices', action.deviceId], (d) => d.set('connected', false).set('connecting', false))
      break

    // Scanning stuffs

    case Types.SCAN_ERROR:
      nextState = state.set('scan_error', action.error)
      break

    default:
      break
  }

  return nextState || state
}

export default ble
