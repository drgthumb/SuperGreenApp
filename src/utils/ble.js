import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'

const NAME_MATCH = /^🤖🍁/

let bleManager// = new BleManager()

const intValue = (v) => Buffer.from(v, 'base64').readUIntLE(0, 4);
const stringValue = (v) => Buffer.from(v, 'base64').toString();

const SERVICE_MAPPING = {
  '4fafc201-1fb5-459e-8fcc-c5c9c331914b': {
    name: 'wifi',
    characteristics: {
      'ff05b1e7-669b-4678-8882-467f029f5165': {
        name: 'status',
        type: stringValue,
      },
      '718226eb-2bc4-4244-b191-02c34d31cde3': {
        name: 'scanWifi',
        type: intValue,
      },
      'd764b280-a943-474a-ad58-2ca6d28488ea': {
        name: 'foundWifi',
        initialValue: [],
        type: stringValue,
      },
      '8ca48df9-f388-4a41-9ae1-36bf4e2a8517': {
        name: 'ssid',
        type: stringValue,
      },
      '2af8b831-3927-49e6-b1bc-8e8aab7434e3': {
        name: 'password',
        type: stringValue,
      }
    }
  },
  '126528f3-7b17-4fd1-ac63-210c9078958e': {
    name: 'time',
    characteristics: {
      '40f9ee4f-e19e-4a8a-aa33-b4aae23b6a9b': {
        name: 'time',
        type: intValue,
      },
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
      }
    },
  },
}

const DEVICE_MAPPING = {}

// TODO fix this mess
const UUIDForDeviceName = (name) => Object.keys(DEVICE_MAPPING).find((v) => DEVICE_MAPPING[v].name == name)
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
        console.log(device.name)
        onChange(device.name, serviceNameForUUID(service.uuid), characteristicNameForUUID(service.uuid, characteristic.uuid), characteristicTypeForUUID(service.uuid, characteristic.uuid)(characteristic.value))
      });
    }
  }
}

const setCharacteristicValue = async (deviceName, serviceName, characteristicName, value) => {
  console.log(DEVICE_MAPPING, ' ', deviceName, ' ', Object.keys(DEVICE_MAPPING));
  const deviceUUID = UUIDForDeviceName(deviceName),
        serviceUUID = UUIDForServiceName(serviceName),
        characteristicUUID = UUIDForCharacteristicName(serviceUUID, characteristicName)
  console.log(deviceUUID, ' ', serviceUUID, ' ', characteristicUUID)
  await bleManager.writeCharacteristicWithResponseForDevice(deviceUUID, serviceUUID, characteristicUUID, new Buffer(value).toString('base64'))
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

    console.log(device.name)
    if (device.name && device.name.match(NAME_MATCH)) {
      device = await device.connect()
      await device.discoverAllServicesAndCharacteristics()
      await device.requestMTU(256)
      const deviceObj = await deviceToObject(device)
      DEVICE_MAPPING[device.id] = deviceObj
      monitorCharacteristics(device, onValueChange, onError)
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
