import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'

const NAME_MATCH = /^🤖🍁/

let bleManager// = new BleManager()

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

const DEVICE_MAPPING = {}

// TODO fix this mess
const UUIDForServiceName = (name) => Object.keys(SERVICE_MAPPING).find((v) => SERVICE_MAPPING[v].name == name)
const UUIDForCharacteristicName = (serviceUUID, name) => Object.keys(SERVICE_MAPPING[serviceUUID].characteristics).find((v) => SERVICE_MAPPING[serviceUUID].characteristics[v].name == name)

const serviceNameForUUID = (uuid) => SERVICE_MAPPING[uuid] && SERVICE_MAPPING[uuid].name
const characteristicNameForUUID = (suuid, uuid) => SERVICE_MAPPING[suuid] && SERVICE_MAPPING[suuid].characteristics[uuid] && SERVICE_MAPPING[suuid].characteristics[uuid].name
const characteristicInitialValueForUUID = (suuid, uuid) => SERVICE_MAPPING[suuid] && SERVICE_MAPPING[suuid].characteristics[uuid] && SERVICE_MAPPING[suuid].characteristics[uuid].initialValue
const characteristicTypeForUUID = (suuid, uuid) => SERVICE_MAPPING[suuid] && SERVICE_MAPPING[suuid].characteristics[uuid] && SERVICE_MAPPING[suuid].characteristics[uuid].type || ((v) => v)

const deviceToObject = async (device) => {
  const res = {
    id: device.id,
    name: device.name,
    services: {}
  }
  services = await device.services()
  for (let i in services) {
    let service = services[i]
    let characteristics = await service.characteristics()
    res.services[serviceNameForUUID(service.uuid)] = {
      uuid: service.uuid,
      name: serviceNameForUUID(service.uuid),
      characteristics: {},
    }
    for (let j in characteristics) {
      let characteristic = await characteristics[j].read()
      res.services[serviceNameForUUID(service.uuid)].characteristics[characteristicNameForUUID(service.uuid, characteristic.uuid)] = {
        uuid: characteristic.uuid,
        name: characteristicNameForUUID(service.uuid, characteristic.uuid),
        value: characteristicInitialValueForUUID(service.uuid, characteristic.uuid) || characteristicTypeForUUID(service.uuid, characteristic.uuid)(characteristic.value),
      }
    }
  }
  return res
}

const monitorCharacteristics = async (device, onChange, onError) => {
  services = await device.services()
  for (let i in services) {
    let service = services[i]
    let characteristics = await service.characteristics()
    for (let j in characteristics) {
      let characteristic = characteristics[j]
      if (!(characteristic.isNotifiable || characteristic.isIndicatable))
        continue
      characteristic.monitor((error, characteristic) => {
        if (error) {
          onError(device.name, error)
          return
        }
        onChange(device.id, serviceNameForUUID(service.uuid), characteristicNameForUUID(service.uuid, characteristic.uuid), characteristicTypeForUUID(service.uuid, characteristic.uuid)(characteristic.value))
      });
    }
  }
}

const setCharacteristicValue = async (deviceId, serviceName, characteristicName, value) => {
  const serviceUUID = UUIDForServiceName(serviceName),
        characteristicUUID = UUIDForCharacteristicName(serviceUUID, characteristicName)
  if (typeof value == 'number') {
    const b = new Buffer(4);
    b.writeIntLE(value, 0, 4);
    await bleManager.writeCharacteristicWithResponseForDevice(deviceId, serviceUUID, characteristicUUID, b.toString('base64'))
  } else {
    await bleManager.writeCharacteristicWithResponseForDevice(deviceId, serviceUUID, characteristicUUID, new Buffer(value).toString('base64'))
  }
}

const init = async () => {
  bleManager = new BleManager()
  await new Promise((resolve, reject) => { 
    const subscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        subscription.remove()
        resolve()
      } else if (state === 'PoweredOff') {
      }
    }, true)
  })
}

const listenDevices = (onDeviceFound, onValueChange, onError) => {
  bleManager.startDeviceScan(null, null, async (error, device) => {
    if (error) {
      onError(null, error)
      return
    }

    if (device.name && device.name.match(NAME_MATCH)) {
      device = await device.connect()
      await device.discoverAllServicesAndCharacteristics()
      await device.requestMTU(256)
      const deviceObj = await deviceToObject(device)
      DEVICE_MAPPING[device.id] = deviceObj
      monitorCharacteristics(device, onValueChange, onError)
      setCharacteristicValue(device.id, 'config', 'time', Date.now())
      onDeviceFound(deviceObj)
    }
  })
  return () => {
    bleManager.stopDeviceScan()
  }
}

export {
  init,
  listenDevices,
  setCharacteristicValue,
}
