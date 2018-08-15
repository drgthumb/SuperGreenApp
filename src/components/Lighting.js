import React from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text, Image, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { withBLECharacteristics } from '../utils/ble.js'
import { Creators } from '../actions/ble'

import textStyles from './TextStyles'
import BigButton from './BigButton'
import SetupLayout, { setupStyles } from './SetupLayout'

import radioOn from './assets/images/radio-on.png'
import radioOff from './assets/images/radio-off.png'

class Lighting extends React.Component {

  render() {
    const { device } = this.props

    const timerType = device.getIn(['services', 'config', 'characteristics', 'timerType', 'value'])

    return (
      <SetupLayout title='Lighting setup'>
        <ScrollView contentContainerStyle={layoutStyles.scrollContent} style={layoutStyles.container}>
          <Text style={setupStyles.title}>1. Timer type</Text>
          <TouchableOpacity onPress={this._handleSelectTimer(1)} style={layoutStyles.radioContainer}>
            <View style={layoutStyles.radioLeft}>
              <View style={layoutStyles.paging}>
                <Image source={timerType === 1 ? radioOn : radioOff} />
              </View>
            </View>
            <View style={layoutStyles.radioRight}>
              <Text style={textStyles.text}>
                <Text style={textStyles.title}>Classic sunrise/sunset timer</Text>{'\n'}
                Sunrise and sunset hours are set manually.{'\n'}
                With classical presets:{'\n'}
                - <Text style={styles.bold}>Grow</Text>: Sunrise at 5 am and sunset at 11 pm (18h long days){'\n'}
                - <Text style={styles.bold}>Bloom</Text>: Sunrise at 9 am and sunset at 9 pm (12h long days){'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleSelectTimer(2)} style={layoutStyles.radioContainer}>
            <View style={layoutStyles.radioLeft}>
              <View style={layoutStyles.paging}>
                <Image source={timerType === 2 ? radioOn : radioOff} />
              </View>
            </View>
            <View style={layoutStyles.radioRight}>
              <Text style={textStyles.text}>
                <Text style={textStyles.title}>Season simulator</Text>{'\n'}
                <Text style={textStyles.italic}>Experimental light control</Text>. Works by simulating sunlight schedules for a given season.{'\n'}
                For example, a typical setup would be:{'\n'}
                <Text style={[textStyles.italic, textStyles.center]}>“Simulate the April-October sunlight schedules in a 3 months long period”</Text>{'\n'}
                The system then simulates day length and light intensity.{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={layoutStyles.next}>
          <BigButton disabled={timerType == 0} onPress={this._handleNext} />
        </View>
      </SetupLayout>
    )
  }

  _handleSelectTimer = (value) => () => {
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'timerType', value))
  }

  _handleNext = () => {
    const { device, navigation } = this.props
    const timerType = device.getIn(['services', 'config', 'characteristics', 'timerType', 'value'])
    if (timerType == 1) {
      navigation.navigate('Classic', { device: device.toJS() })
    } else if (timerType == 2) {
      navigation.navigate('Season', { device: device.toJS() })
    }
  }
}

const styles = StyleSheet.create({
})

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 25,
    paddingTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioLeft: {
  },
  radioRight: {
    marginLeft: 10,
    marginRight: 10,
  },
  next: {
    backgroundColor: 'white',
    marginLeft: 20, marginRight: 20,
  },
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(withBLECharacteristics(['timerType'])(Lighting))
