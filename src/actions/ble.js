import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  deviceDiscovered: ['device'],
  characteristicChanged: ['deviceName', 'serviceName', 'characteristicName', 'value'],
  scan: ['deviceName'],
  error: ['deviceName', 'error'],
})

export {
  Types,
  Creators,
}
