import _ from 'lodash'
import { fromJS } from 'immutable'
import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { PermissionsAndroid, Platform } from 'react-native'
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

// not even sry
const stringValue = (v) => v == 'AA==' ? '' : Buffer.from(v, 'base64').toString() || ''

const ledInfoValue = (v) => {
  v = stringValue(v)
  const data = v.split('|')
  data.shift()
  const res = _.map(data, (d) => {
    const l = d.split(';')
    return _.reduce(l, (acc, l) => {
      l = l.split(':')
      acc[l[0]] = parseInt(l[1])
      return acc
    }, {})
  })

  return fromJS(res)
}

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
      '6df781fe-6dce-5234-1870-6a972114c596': {
        name: 'ledInfo',
        type: ledInfoValue,
        initialValue: [],
      },
      // Hardcode X leds (driver doesn't go further than 6 leds for now anyway)
      '4291ec1b-65df-19c4-c5f1-e4259071fc00': {
        name: 'led_0_duty',
        type: intValue,
      },
      '4291ec1b-65df-19c4-c5f1-e4259071fc01': {
        name: 'led_1_duty',
        type: intValue,
      },
      '4291ec1b-65df-19c4-c5f1-e4259071fc02': {
        name: 'led_2_duty',
        type: intValue,
      },
      '4291ec1b-65df-19c4-c5f1-e4259071fc03': {
        name: 'led_3_duty',
        type: intValue,
      },
      '4291ec1b-65df-19c4-c5f1-e4259071fc04': {
        name: 'led_4_duty',
        type: intValue,
      },
      '4291ec1b-65df-19c4-c5f1-e4259071fc05': {
        name: 'led_5_duty',
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
        name: 'wifiStatus',
        type: intValue,
      },
      '6ca36981-9c55-74a5-5415-e16bc1c3fe17': {
        name: 'wifiSsid',
        type: stringValue,
        initialValue: '',
      },
      'f7e40b10-6cfe-a6f1-fea0-cc6e82535db9': {
        name: 'wifiPassword',
        type: stringValue,
        initialValue: '',
      },

      /* MIXER */
      '7072326b-95b0-4822-a5e1-b2cc47875ae5': {
        name: 'stretch',
        type: intValue,
      },
      'a66375f6-7677-ba29-46b7-0fde55b0db61': {
        name: 'ledDim',
        type: intValue,
      },

      /* MIXER */
      '03b7cea7-bedc-e37f-1bfd-7f2ab70a5e7b': {
        name: 'blower',
        type: intValue,
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
          return
        }
        emitter(Creators.characteristicValueChanged(deviceId, serviceName, characteristicName, characteristicTypeForUUID(characteristic.serviceUUID, characteristic.uuid)(characteristic.value)))
      })
    }
    const value = characteristicTypeForUUID(characteristic.serviceUUID, characteristic.uuid)(characteristic.value)
    //console.log(`${characteristicName} ${characteristic.value} ${value} ${value.length}`)
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
          connected: true,
          initialLoad: false,
          get_value_error: null,
          monitoring_error: null,
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
        deviceObj.initialLoad = true
        emitter(Creators.deviceDiscovered(fromJS(deviceObj)))
        await getCharacteristicValue(deviceObj.id, 'config', 'state')
        await setCharacteristicValue(deviceObj.id, 'config', 'time', parseInt(Date.now() / 1000))
      } catch (e) {
        console.log('listenDevices', e)
        emitter(Creators.deviceDiscoverError(device.id, fromJS(e)))
        no_dups[device.id] = undefined
      }
    }
  })
}

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        'title': 'SuperGreenApp Bluetooth authorization',
        'message': 'This is needed in order to access your bluetooth SuperGreenDriver'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the bluetooth adaptor")
    } else {
      console.log("Bluetooth permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

const startBluetoothStack = async () => {
  let scanInterval;
  if (Platform.OS === 'android') {
    await requestLocationPermission()
  }
  bleManager.onStateChange((state) => {
    if (state === 'PoweredOn') {
      emitter(Creators.ready())
      if (!scanInterval) {
        scanInterval = setInterval(listenDevices, 10000)
      }
    } else {
      if (scanInterval) {
        clearInterval(scanInterval)
        scanInterval = null
      }
      emitter(Creators.notReady())
    }
  }, true)
}

const setBluetoothEventsEmitter = (_emitter) => {
  emitter = _emitter
  return () => {}
}

const withBLECharacteristics = (characteristics) => (Component) => {
  const mapStateToProps = (state, props) => _.reduce(characteristics, (acc, c) => {
    acc[c] = state.getIn(['ble', 'devices', props.device.get('id'), 'services', 'config', 'characteristics', c])
    return acc
  }, {})

  return connect(mapStateToProps)(class extends React.Component {

    componentDidMount() {
      this._loadCharacteristics(this.props)
    }

    render() {
      const { device } = this.props
      const loading = !!_.find(characteristics, (c) => !this.props[c].get('loaded'));

      return (
        <View style={styles.container}>
          <Component bleLoading={loading} {...this.props} />
          { loading && (
            <View style={styles.overlay}>
              <Text style={styles.wait}>Waiting bluetooth..</Text>
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      )
    }

    _loadCharacteristics(props) {
      const { device, dispatch } = props
      if (!device.get('connected')) return
      _.forEach(characteristics, (c) => {
        if (!device.getIn(['services', 'config', 'characteristics', c, 'loaded']) &&
            !device.getIn(['services', 'config', 'characteristics', c, 'getting'])) {
          dispatch(Creators.getCharacteristicValue(device.get('id'), 'config', c))
        }
      })
    }

  })

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0, left: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  wait: {
    margin: 30,
  },
})

export {
  setBluetoothEventsEmitter,
  startBluetoothStack,
  getCharacteristicValue,
  setCharacteristicValue,
  withBLECharacteristics,
}
