import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, Slider, Image, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { withBLECharacteristics } from '../utils/ble.js'
import { Creators } from '../actions/ble'

import textStyles from './TextStyles'
import Separator from './Separator'
import BigButton from './BigButton'
import SetupLayout from './SetupLayout'

import prev from './assets/images/paging-prev.png'
import next from './assets/images/paging-next.png'
import switchOn from './assets/images/switch-on.png'
import switchOff from './assets/images/switch-off.png'
import cloudy from './assets/images/cloudy.png'
import sun from './assets/images/sun.png'
import minimumTrack from './assets/images/minimum-track.png'
import maximumTrack from './assets/images/maximum-track.png'
import slider from './assets/images/slider.png'

const LED_MIN_DUTY = 0
const LED_MAX_DUTY = 100

class LedTester extends React.Component {

  state = {led: 0}

  render() {
    const { led } = this.state
    const { device } = this.props

    const duty = this.props[this.duty()].get('value')

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
              </Text>
            </View>
            <TouchableOpacity onPress={this._handleLedChanged(led+1)} style={layoutStyles.paging} disabled={led == 5} style={{opacity: led == 5 ? 0.4 : 1}}>
              <Image source={next} />
            </TouchableOpacity>
          </View>
          <Separator />
          <View style={layoutStyles.switches}>
            <View style={layoutStyles.brightness}>
              <Text style={textStyles.text}>Brightness</Text>
              <View style={layoutStyles.slider}>
                <Image style={layoutStyles.sliderPic} source={cloudy} />
                <Slider value={duty}
                  minimumValue={LED_MIN_DUTY}
                  maximumValue={LED_MAX_DUTY}
                  minimumTrackImage={minimumTrack}
                  maximumTrackImage={maximumTrack}
                  thumbImage={slider}
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
    const { ledInfo } = this.props
    this.setState({led: Math.min(ledInfo.get('value').size, Math.max(value, 0))});
  }

  _handleBrightnessChanged = (value) => {
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', this.duty(), Math.floor(value)))
  }

  _handleNext = () => {
    const { device, navigation } = this.props
    navigation.navigate('Lighting', { device: device.toJS() })
  }
  
  //

  duty() {
    const { led } = this.state
    return `led_${led}_duty`
  }

}

class SelfTest extends React.Component {

  componentWillReceiveProps(newProps) {
    const { ledInfo: oledInfo } = this.props
    const { ledInfo } = newProps

    if (oledInfo && ledInfo && oledInfo.get('value') != ledInfo.get('value') && ledInfo.get('value').size) {
      this.LedTester = withBLECharacteristics(_.times(ledInfo.get('value').size, (i) => `led_${i}_duty`))(LedTester)
    }
  }

  render() {
    const LedTesterComp = this.LedTester || View
    return (
      <LedTesterComp {...this.props} />
    )
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
    marginTop: 0,
  },
  brightness: {
    alignItems: 'center',
  },
  slider: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default connect(mapStateToProps)(withBLECharacteristics(['ledInfo'])(SelfTest))
