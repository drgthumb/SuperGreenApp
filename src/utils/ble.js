import { fromJS } from 'immutable'
import React from 'react'
import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'

import { Creators } from '../actions/ble'

const NAME_MATCH = '🤖🍁'

const bleManager = new BleManager()
let emitter // saga channel emitter

const intValue = (v) => {
  try {
    return Buffer.from(v, 'base64').readUIntLE(0, 4)
  } catch (e) {
    return 0
  }
}

const stringValue = (v) => Buffer.from(v, 'base64').toString()

const SERVICE_MAPPING = {
  '000000ff-0000-1000-8000-00805f9b34fb': {
    name: 'config',
    characteristics: {
      'a6317732-8c0e-ee6e-68ee-61f13d4f8b25': {
        name: 'name',
        time: stringValue,
      },

      /* TIME */
      '40f9ee4f-e19e-4a8a-aa33-b4aae23b6a9b': {
        name: 'time',
        type: intValue,
      },

      /* STATE */
      '8ff6dfd2-3bd6-feb4-43ec-de5663122894': {
        name: 'state',
        type: intValue,
      },

      /* LED */
     '4750daf8-0f06-ad2b-178e-ec58c7f30421': {
        name: 'led_0_0_pwr',
        type: intValue,
      },
     '3c14371f-b1b6-6d66-cc02-b01396f6f84f': {
        name: 'led_0_1_pwr',
        type: intValue,
      },
     'ca2a9037-7626-6751-60fb-c3922021cc42': {
        name: 'led_0_2_pwr',
        type: intValue,
      },
     '0365b1c9-4079-4caf-51f4-2730ca055bb5': {
        name: 'led_1_0_pwr',
        type: intValue,
      },
     'ab2abc56-1a48-84d1-1b20-6c0035d7c9eb': {
        name: 'led_1_1_pwr',
        type: intValue,
      },
     '05a5cc9e-a67b-bc62-2577-6ceb69cbc567': {
        name: 'led_1_2_pwr',
        type: intValue,
      },

     '4291ec1b-65df-19c4-c5f1-e4259071fc5d': {
        name: 'led_0_0_duty',
        type: intValue,
      },
     '18a17b54-716d-3eb8-af12-b447d7c81cd8': {
        name: 'led_0_1_duty',
        type: intValue,
      },
     '2914d978-e7d9-6f5a-36e8-1a11011ab737': {
        name: 'led_0_2_duty',
        type: intValue,
      },
     '4cba86fc-e385-3cd2-2de5-5c7ef8a6ed40': {
        name: 'led_1_0_duty',
        type: intValue,
      },
     '5b11c5f4-67b6-c712-fc1c-4b13fa9fd3cb': {
        name: 'led_1_1_duty',
        type: intValue,
      },
     'bd87b60e-30b7-d99c-56e2-cd377da4494e': {
        name: 'led_1_2_duty',
        type: intValue,
      },

      /* TIMER TYPE */
      '5f5ea840-3aa9-0a7b-343d-415ab2faa9f3': {
        name: 'timerType',
        type: intValue,
      },
      'b2286094-8299-a967-db89-ee856e365789': {
        name: 'timerOutput',
        type: intValue,
      },

      /* ONOFF */
      'e867f9a6-4ab7-09da-ef26-19f350ed4ba1': {
        name: 'onHour',
        type: intValue,
      },
      '7528a50b-dd3b-f714-62f5-7167f1791347': {
        name: 'onMin',
        type: intValue,
      },
      '5dafb88c-9d7e-ab6b-0253-12294c35beae': {
        name: 'offHour',
        type: intValue,
      },
      '086aa1e1-d9ab-2d22-4110-4f3f05efd3d4': {
        name: 'offMin',
        type: intValue,
      },


      /* SEASON */
      '3867a37c-85a9-338c-40ac-96d4ee586841': {
        name: 'simulatedTime',
        type: intValue,
      },
      '829bfbd2-a7e1-4c16-b7e2-4a8fd6261f40': {
        name: 'startDateMonth',
        type: intValue,
      },
      '547af7e1-6a8c-4fbc-b568-9c3f194cdc1e': {
        name: 'startDateDay',
        type: intValue,
      },
      '495600fd-947d-4157-a996-20780ad1d81a': {
        name: 'durationDays',
        type: intValue,
      },
      '6f01cd48-a405-45e5-99db-0de8b5ca2e7f': {
        name: 'simulationDurationDays',
        type: intValue,
      },
      '1f450234-f101-4f57-ba39-304b053b95a2': {
        name: 'startedAt',
        type: intValue,
      },

      /* WIFI */
      '372fda1c-6d67-cbda-f083-ae31b50e06ee': {
        name: 'wifi_status',
        type: intValue,
      },
      '6ca36981-9c55-74a5-5415-e16bc1c3fe17': {
        name: 'wifi_ssid',
        type: stringValue,
      },
      'f7e40b10-6cfe-a6f1-fea0-cc6e82535db9': {
        name: 'wifi_password',
        type: stringValue,
      },
    },
  },
}

// TODO fix this mess
const UUIDForServiceName = (name) => Object.keys(SERVICE_MAPPING).find((v) => SERVICE_MAPPING[v].name == name)
const UUIDForCharacteristicName = (serviceUUID, name) => Object.keys(SERVICE_MAPPING[serviceUUID].characteristics).find((v) => SERVICE_MAPPING[serviceUUID].characteristics[v].name == name)

const serviceNameForUUID = (uuid) => SERVICE_MAPPING[uuid] && SERVICE_MAPPING[uuid].name
const characteristicNameForUUID = (suuid, uuid) => SERVICE_MAPPING[suuid] && SERVICE_MAPPING[suuid].characteristics[uuid] && SERVICE_MAPPING[suuid].characteristics[uuid].name
const characteristicInitialValueForUUID = (suuid, uuid) => SERVICE_MAPPING[suuid] && SERVICE_MAPPING[suuid].characteristics[uuid] && SERVICE_MAPPING[suuid].characteristics[uuid].initialValue
const characteristicTypeForUUID = (suuid, uuid) => SERVICE_MAPPING[suuid] && SERVICE_MAPPING[suuid].characteristics[uuid] && SERVICE_MAPPING[suuid].characteristics[uuid].type || ((v) => v)

const deviceServicesToObject = async (device) => {
  const res = {}

  try {
    await device.discoverAllServicesAndCharacteristics()
    services = await device.services()
    for (let i in services) {
      let service = services[i]
      let characteristics = await service.characteristics()
      res[serviceNameForUUID(service.uuid)] = {
        uuid: service.uuid,
        name: serviceNameForUUID(service.uuid),
        characteristics: {},
      }
      for (let j in characteristics) {
        if (!characteristics[j].isReadable) continue
        res[serviceNameForUUID(service.uuid)].characteristics[characteristicNameForUUID(service.uuid, characteristics[j].uuid)] = {
          uuid: characteristics[j].uuid,
          loaded: false,
          name: characteristicNameForUUID(service.uuid, characteristics[j].uuid),
          value: characteristicInitialValueForUUID(service.uuid, characteristics[j].uuid),
        }
      }
    }
  } catch(e) {
    console.log('deviceToObject', e)
  }

  return res
}

const setCharacteristicValue = async (deviceId, serviceName, characteristicName, value) => {
  try {
    const serviceUUID = UUIDForServiceName(serviceName),
      characteristicUUID = UUIDForCharacteristicName(serviceUUID, characteristicName)

    emitter(Creators.settingCharacteristicValue(deviceId, serviceName, characteristicName))
    if (typeof value == 'number') {
      const b = new Buffer(4);
      value = Math.floor(value)
      b.writeIntLE(value, 0, 4);
      await bleManager.writeCharacteristicWithResponseForDevice(deviceId, serviceUUID, characteristicUUID, b.toString('base64'))
    } else {
      await bleManager.writeCharacteristicWithResponseForDevice(deviceId, serviceUUID, characteristicUUID, new Buffer(value).toString('base64'))
    }
    emitter(Creators.characteristicValueSet(deviceId, serviceName, characteristicName, value))
  } catch(e) {
    emitter(Creators.setCharacteristicValueError(deviceId, serviceName, characteristicName, fromJS(e)))
    console.log('setCharacteristicValue', e)
  }
}

const getCharacteristicValue = async (deviceId, serviceName, characteristicName) => {
  try {
    const serviceUUID = UUIDForServiceName(serviceName),
      characteristicUUID = UUIDForCharacteristicName(serviceUUID, characteristicName)

    emitter(Creators.gettingCharacteristicValue(deviceId, serviceName, characteristicName))
    const characteristic = await bleManager.readCharacteristicForDevice(deviceId, serviceUUID, characteristicUUID)
    if (characteristic.isNotifiable) {
      const serviceName =  serviceNameForUUID(characteristic.serviceUUID),
            characteristicName = characteristicNameForUUID(characteristic.serviceUUID, characteristic.uuid)
      characteristic.monitor((error, characteristic) => {
        if (error) {
          emitter(Creators.monitoringError(deviceId, serviceName, characteristicName, fromJS(error)))
        }
        emitter(Creators.characteristicValueChanged(deviceId, serviceName, characteristicName, characteristicTypeForUUID(characteristic.serviceUUID, characteristic.uuid)(characteristic.value)))
      })
    }
    const value = characteristicTypeForUUID(characteristic.serviceUUID, characteristic.uuid)(characteristic.value)
    emitter(Creators.gotCharacteristicValue(deviceId, serviceName, characteristicName, value))
    return value
  } catch(e) {
    emitter(Creators.getCharacteristicValueError(deviceId, serviceName, characteristicName, fromJS(e)))
    console.log('getCharacteristicValue', e)
  }
}

const listenDevices = () => {
  const no_dups = {}
  bleManager.startDeviceScan(null, null, async (error, device) => {
    if (error) {
      emitter(Creators.scanError(error))
      return
    }

    if (!device.name) {
      return
    }

    if (device.name == NAME_MATCH) {
      console.log('Found device', device.name)
      if (no_dups[device.id] == true) {
        return
      }
      no_dups[device.id] = true

      try {
        const deviceObj = {
          id: device.id,
          name: device.name,
          connected: false,
          services: {},
        }
        emitter(Creators.deviceDiscovered(fromJS(deviceObj)))

        try {
          emitter(Creators.deviceConnecting(device.id))
          device = await device.connect()
          emitter(Creators.deviceConnected(device.id))
        } catch(e) {
          emitter(Creators.deviceConnectionError(device.id, fromJS(e)))
          throw e
        }

        device.onDisconnected(async (error, device) => {
          emitter(Creators.deviceDisconnected(device.id))
          no_dups[device.id] = undefined
        })

        deviceObj.services = await deviceServicesToObject(device)
        emitter(Creators.deviceDiscovered(fromJS(deviceObj)))
        await setCharacteristicValue(deviceObj.id, 'config', 'time', Date.now() / 1000)
      } catch (e) {
        console.log('listenDevices', e)
        emitter(Creators.deviceDiscoverError(device.id, fromJS(e)))
        no_dups[device.id] = undefined
      }
    }
  })
}

const startBluetoothStack = async () => {
  console.log('startBluetoothStack')
  bleManager.onStateChange((state) => {
    console.log('bleManager.onStateChange')
    if (state === 'PoweredOn') {
      emitter(Creators.ready())
      listenDevices()
    } else {
      emitter(Creators.notReady())
    }
  }, true)
}

const setBluetoothEventsEmitter = (_emitter) => {
  emitter = _emitter
  return () => {}
}

class BLEHOC extends React.Component {

  componentDidMount() {
    const { device } = this.props
  }

  render() {
    const { children } = this.props
    return (
      {...children}
    )
  }

}

export {
  setBluetoothEventsEmitter,
  startBluetoothStack,
  getCharacteristicValue,
  setCharacteristicValue,
  BLEHOC,
}
