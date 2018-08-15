import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { withBLECharacteristics } from '../utils/ble.js'
import { Creators } from '../actions/ble'

import BigButton from './BigButton'
import SetupLayout from './SetupLayout'

class Input extends React.Component {

  render() {
    return (
      <View style={inputStyles.container}>
        <TextInput {...this.props} style={inputStyles.text} />
      </View>
    )
  }

}

const inputStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: 'white',
    height: 40,
    padding: 5,
    margin: 5,
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
})

const STATES = ['Disconnected', 'Connecting', 'Connected']

class Wifi extends React.Component {

  state = {ssid: '', password: '', submitted: false}

  componentWillReceiveProps(newProps) {
    const { device, navigation } = newProps
    const { device: odevice } = this.props
    const state = device.getIn(['services', 'config', 'characteristics', 'wifi_status', 'value'])
    const ostate = odevice.getIn(['services', 'config', 'characteristics', 'wifi_status', 'value'])
    const dssid = device.getIn(['services', 'config', 'characteristics', 'wifi_ssid', 'value'])
    const odssid = odevice.getIn(['services', 'config', 'characteristics', 'wifi_ssid', 'value'])

    if (dssid !== odssid) {
      this.setState({ ssid: dssid })
    }

    if (state !== ostate) {
      if (state == 3) {
        console.log('CONNECTED');
        navigation.navigate('SelfTest', { device: device.toJS() })
      }
    }
  }

  componentDidMount() {
    const { device, navigation } = this.props
    const state = device.getIn(['services', 'config', 'characteristics', 'wifi_status', 'value'])
    if (state == 3) {
      navigation.navigate('SelfTest', { device: device.toJS() })
    }
  }

  render() {
    const { submitted } = this.state
    return (
      <SetupLayout title='Wifi setup'>
        { submitted ? this.renderLoading() : this.renderForm() }
      </SetupLayout>
    )
  }

  renderForm() {
    const { ssid, password } = this.state
    return (
      <View style={layoutStyles.container}>
        <Input placeholder='SSID' onChangeText={(value) => this.setState({ssid: value})} value={ssid} />
        <Input placeholder='Password' secureTextEntry={true} onChangeText={(value) => this.setState({password: value})} value={password} />
        <BigButton disabled={!ssid || !password} onPress={this._handleSetWifi} />
      </View>
    )
  }

  renderLoading() {
    const { device } = this.props
    const state = device.getIn(['services', 'config', 'characteristics', 'wifi_status', 'value'])

    if (state == 4) {
      return (
        <View style={layoutStyles.container}>
          <Text style={styles.title}>
            Connection failed
          </Text>
          <BigButton title='Retry' onPress={this._handleRetry} />
        </View>
      )
    }
    return (
      <View style={layoutStyles.container}>
        <Text style={styles.title}>
          Connecting Wifi,{"\n"}
          please wait..
        </Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  _handleRetry = () => {
    this.setState({submitted: false})
  }

  _handleSetWifi = () => {
    const { dispatch, device } = this.props
    const { ssid, password } = this.state

    this.setState({submitted: true})
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'wifi_ssid', ssid))
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'wifi_password', password))
  }

}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    color: '#A7A7A7',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
})

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    margin: 25,
  },
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(withBLECharacteristics(['wifi_ssid', 'wifi_password', 'wifi_status'])(Wifi))
