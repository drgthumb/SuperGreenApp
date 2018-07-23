import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  ready: [],
  notReady: [],

  setCharacteristicValue: ['deviceId', 'serviceName', 'characteristicName', 'value'],
  settingCharacteristicValue: ['deviceId', 'serviceName', 'characteristicName'],
  characteristicValueSet: ['deviceId', 'serviceName', 'characteristicName'],
  setCharacteristicValueError: ['deviceId', 'serviceName', 'characteristicName', 'error'],

  getCharacteristicValue: ['deviceId', 'serviceName', 'characteristicName'],
  gettingCharacteristicValue: ['deviceId', 'serviceName', 'characteristicName'],
  gotCharacteristicValue: ['deviceId', 'serviceName', 'characteristicName'],
  getCharacteristicValueError: ['deviceId', 'serviceName', 'characteristicName', 'error'],

  characteristicValueChanged: ['deviceId', 'serviceName', 'characteristicName', 'value'],
  monitoringError: ['deviceId', 'serviceName', 'characteristicName', 'error'],

  deviceDiscovered: ['device'],
  deviceDiscoverError: ['error'],
  deviceConnected: ['deviceId'],
  deviceConnecting: ['deviceId'],
  deviceConnectionError: ['deviceId', 'error'],
  deviceDisconnected: ['deviceId'],

  scanError: ['error'],
})

export {
  Types,
  Creators,
}
