import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  setCharacteristicValue: ['deviceId', 'serviceName', 'characteristicName', 'value'],
  readCharacterisitcValue: ['deviceId', 'serviceName', 'characteristicName'],
  deviceDiscovered: ['device'],
  characteristicChanged: ['deviceId', 'serviceName', 'characteristicName', 'value'],
  error: ['deviceId', 'error'],
})

export {
  Types,
  Creators,
}
