import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, Slider, Image, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

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
              <Text style={styles.smallText}>Testing led</Text>
              <Text style={styles.bigText}>{led+1}</Text>
              <Text style={styles.smallText}>{LED_PLACES[led]}</Text>
            </View>
            <TouchableOpacity onPress={this._handleLedChanged(led+1)} style={layoutStyles.paging} disabled={led == 5} style={{opacity: led == 5 ? 0.4 : 1}}>
              <Image source={next} />
            </TouchableOpacity>
          </View>
          <View style={layoutStyles.switches}>
            <View style={layoutStyles.radio}>
              <Text style={styles.smallText}>Power switch:</Text>
              <TouchableOpacity onPress={this._handlePowerChanged(power ? 0 : 100)} >
                <Image source={power ? switchOn : switchOff} />
              </TouchableOpacity>
            </View>
            <View style={layoutStyles.brightness}>
              <Text style={styles.smallText}>Brightness</Text>
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

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    color: '#A7A7A7',
    textAlign: 'left',
    margin: 20,
    marginTop: 30,
    marginBottom: 40,
  },
  smallText: {
    color: '#727272',
    fontSize: 20,
  },
  bigText: {
    color: '#31B840',
    fontSize: 70,
  },
})

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
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(SelfTest)
