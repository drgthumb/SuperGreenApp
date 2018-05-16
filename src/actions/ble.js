import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  setCharacteristicValue: ['deviceId', 'serviceName', 'characteristicName', 'value'],
  deviceDiscovered: ['device'],
  characteristicChanged: ['deviceId', 'serviceName', 'characteristicName', 'value'],
  error: ['deviceId', 'error'],
})

export {
  Types,
  Creators,
}
