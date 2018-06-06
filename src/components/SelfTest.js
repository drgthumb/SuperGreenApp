import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, Slider, Image, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import textStyles from './TextStyles'
import BigButton from './BigButton'
import SetupLayout from './SetupLayout'

import prev from './assets/images/paging-prev.png'
import next from './assets/images/paging-next.png'
import switchOn from './assets/images/switch-on.png'
import switchOff from './assets/images/switch-off.png'
import cloudy from './assets/images/cloudy.png'
import sun from './assets/images/sun.png'

const LED_PLACES = ['Bottom, side A', 'Middle, side A', 'Top, side A', 'Bottom, side B', 'Middle, side B', 'Top, side B'];
const LED_MIN_DUTY = 550
const LED_MAX_DUTY = 8191

class SelfTest extends React.Component {

  state = {led: 0}

  render() {
    const { led } = this.state
    const { device } = this.props

    const power = device.getIn(['services', 'config', 'characteristics', this.power(), 'value'])
    const duty = device.getIn(['services', 'config', 'characteristics', this.duty(), 'value'])

    return (
      <SetupLayout title='Assembly test'>
        <View style={layoutStyles.container}>
          <View style={layoutStyles.selector}>
            <TouchableOpacity onPress={this._handleLedChanged(led-1)} style={layoutStyles.paging} disabled={led == 0} style={{opacity: led == 0 ? 0.4 : 1}}>
              <Image source={prev} />
            </TouchableOpacity>
            <View style={layoutStyles.selected}>
              <Text style={[textStyles.center, textStyles.text]}>
                <Text>Testing led</Text>{'\n'}
                <Text style={textStyles.bigStatus}>{led+1}</Text>{'\n'}
                <Text>({LED_PLACES[led]})</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={this._handleLedChanged(led+1)} style={layoutStyles.paging} disabled={led == 5} style={{opacity: led == 5 ? 0.4 : 1}}>
              <Image source={next} />
            </TouchableOpacity>
          </View>
          <View style={layoutStyles.switches}>
            <View style={layoutStyles.radio}>
              <Text style={textStyles.text}>Power switch:{' '}</Text>
              <TouchableOpacity onPress={this._handlePowerChanged(power ? 0 : 100)} >
                <Image source={power ? switchOn : switchOff} />
              </TouchableOpacity>
            </View>
            <View style={layoutStyles.brightness}>
              <Text style={textStyles.text}>Brightness</Text>
              <View style={layoutStyles.slider}>
                <Image style={layoutStyles.sliderPic} source={cloudy} />
                <Slider value={duty}
                  minimumValue={LED_MIN_DUTY}
                  maximumValue={LED_MAX_DUTY}
                  onSlidingComplete={this._handleBrightnessChanged}
                  style={layoutStyles.sliderTrack} />
                <Image style={layoutStyles.sliderPic} source={sun} />
              </View>
            </View>
          </View>
          <View style={layoutStyles.next}>
            <BigButton onPress={this._handleNext} />
          </View>
        </View>
      </SetupLayout>
    )
  }

  _handleLedChanged = (value) => () => {
    this.setState({led: Math.min(5, Math.max(value, 0))});
  }

  _handlePowerChanged = (value) => () => {
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', this.power(), value))
  }

  _handleBrightnessChanged = (value) => {
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', this.duty(), value))
  }

  _handleNext = () => {
    const { device, navigation } = this.props
    navigation.navigate('Lighting', { device: device.toJS() })
  }
  
  //

  duty() {
    const { led } = this.state
    const side = Math.floor(led / 3)
    const num = led % 3
    return `led_${side}_${num}_duty`
  }

  power() {
    const { led } = this.state
    const side = Math.floor(led / 3)
    const num = led % 3
    return `led_${side}_${num}_pwr`
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  paging: {
  },
  selected: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switches: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: 25,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brightness: {
    alignItems: 'center',
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  sliderPic: {
  },
  sliderTrack: {
    flex: 1,
  },
  next: {
    marginLeft: 20, marginRight: 20,
  },
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(SelfTest)
