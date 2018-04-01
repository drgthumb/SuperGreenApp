/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'

const NAME_MATCH = "DEASurvVan1"

type Props = {}
export default class App extends Component<Props> {

  constructor() {
    super()
    this.manager = new BleManager()
    this.state = {on: false, devices: {}}
  }

  componentDidMount() {
    const subscription = this.manager.onStateChange((state) => {
      console.log('##################3', state)
      if (state === 'PoweredOn') {
        this.setState({on: true})
        this.scanAndConnect()
        subscription.remove()
      }
    }, true)
  }

  render() {
    const { on, devices } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          {on ? "ON" : "OFF"}
        </Text>
        { Object.keys(devices).sort().map((k) => (
          <Text key={devices[k].id} style={styles.instructions}>
            device {devices[k].name}
          </Text>
        ))}
      </View>
    )
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return
      }

      const { devices } = this.state
      devices[device.id] = device
      this.setState({devices})

      if (device.name == '🤖🍁') {
				this.manager.stopDeviceScan()
				this.connect(device)
			}
    });
  }

	async connect(device) {
		try {
			device = await device.connect()
			await device.discoverAllServicesAndCharacteristics()
			services = await device.services()
			for (let i in services) {
				let service = services[i]
				let characteristics = await service.characteristics()
				console.log(`service: ${service.id} ${service.uuid} (${characteristics.length})`)
				for (let j in characteristics) {
					let characteristic = characteristics[j]
          if (!characteristic.isWritableWithResponse) {
            continue
          }
          characteristic = await characteristic.read()
          const json = Buffer.from(characteristic.value, 'base64').toString()
          console.log(json)
          let value = JSON.parse(json)
					console.log(`characteristic: ${characteristic.id} ${characteristic.uuid} ${characteristic.value} ${value}`)
          value.value++
          await characteristic.writeWithResponse(new Buffer(JSON.stringify(value)).toString('base64'))
				}
			}
		} catch(e) {
			console.log(e)
		}
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
