import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, ScrollView, Image, Slider, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import logo from './assets/images/logo.png'
import sunglass from './assets/images/sunglass.png'
import sunrise from './assets/images/sunrise.png'
import sunset from './assets/images/sunset.png'
import edit from './assets/images/edit.png'
import minimumTrack from './assets/images/minimum-track.png'
import maximumTrack from './assets/images/maximum-track.png'
import slider from './assets/images/slider.png'

import textStyles from './TextStyles'

import Separator from './Separator'

class Device extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {nav: 'status'}

  renderManualTimer() {
    return (
      <View style={layoutStyles.timerType}>
        <Text style={textStyles.bigStatus}>MANUAL</Text>
      </View>
    )
  }

  renderClassicTimer() {
    const { device } = this.props
    const onHour = device.getIn(['services', 'config', 'characteristics', 'onHour', 'value'])
    const onMin = device.getIn(['services', 'config', 'characteristics', 'onMin', 'value'])
    const offHour = device.getIn(['services', 'config', 'characteristics', 'offHour', 'value'])
    const offMin = device.getIn(['services', 'config', 'characteristics', 'offMin', 'value'])
    return (
      <View style={layoutStyles.timerType}>
        <View style={layoutStyles.hours}>
          <View style={layoutStyles.hour}>
            <Image source={sunrise} />
            <Text style={[textStyles.text, textStyles.big]}>{' '}{onHour}h{onMin}</Text>
          </View>
          <View style={layoutStyles.hour}>
            <Image source={sunset} />
            <Text style={[textStyles.text, textStyles.big]}>{' '}{offHour}h{offMin}</Text>
          </View>
          <TouchableOpacity onPress={this._handleEditClassTimer}>
            <Image source={edit} />
          </TouchableOpacity>
        </View>
        <View style={layoutStyles.light}>
          <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
            Light intensity{'\n'}
            <Text style={textStyles.bigNumber}>
              94%
            </Text>
          </Text>
        </View>
      </View>
    )
  }

  renderSeasonTimer() {
    return (
      <View style={layoutStyles.timerType}>
        <Text style={textStyles.bigStatus}>SEASON</Text>
      </View>
    )
  }

  render() {
    const { device } = this.props
    const timerType = device.getIn(['services', 'config', 'characteristics', `timerType`, 'value'])
    return (
      <View style={layoutStyles.container}>
        <Image style={layoutStyles.logo} source={logo} />
        <View style={layoutStyles.status}>
          <Text style={[textStyles.text, textStyles.center]}>
            Everything seems{'\n'}
            <Text style={textStyles.bigStatus}>OK</Text>
          </Text>
        </View>
        <ScrollView style={layoutStyles.body} contentContainerStyle={layoutStyles.scrollContent}>
          <Separator />
          <View style={layoutStyles.dimmer}>
            <Text style={[textStyles.text, textStyles.medium, layoutStyles.dimmerText]}>
              Dim lights by pressing this button
              before opening doors !
            </Text>
            <TouchableOpacity style={layoutStyles.dimmerButton}>
              <Image style={layoutStyles.sunglass} resizeMode='contain' source={sunglass} />
            </TouchableOpacity>
          </View>
          <Separator />
          <View style={layoutStyles.timer}>
            <Text style={[textStyles.text, textStyles.title]}>Timer settings</Text>
            { timerType == 0 && this.renderManualTimer() }
            { timerType == 1 && this.renderClassicTimer() }
            { timerType == 2 && this.renderSeasonTimer() }
          </View>
          <Separator />
          <View style={layoutStyles.slider}>
            <Text>Stretch</Text>
            <Slider value={0}
              minimumValue={0}
              maximumValue={100}
              minimumTrackImage={minimumTrack}
              maximumTrackImage={maximumTrack}
              thumbImage={slider}
              onSlidingComplete={this._handleGrowthTypeChanged}
              style={layoutStyles.sliderTrack} />
            <Text>Thicken</Text>
          </View>
          <Separator />
          <View style={layoutStyles.sensors}>
            <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
              Temp{'\n'}
              <Text style={textStyles.bigStatus}>28.5˚</Text>
            </Text>
            <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
              Extraction fan{'\n'}
              <Text style={textStyles.bigStatus}>15%</Text>
            </Text>
          </View>
          <View style={layoutStyles.days}>
            <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
              Happy{'\n'}
              <Text style={textStyles.bigNumber}>53<Text style={[textStyles.thin]}>rd</Text></Text> day !
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  _handleEditClassTimer = () => {
    console.log('_handleEditClassTimer')
  }

  _handleGrowthTypeChanged = () => {
    console.log('_handleGrowthTypeChanged')
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 27,
  },
  logo: {
    width: 60,
    height: 60,
    marginLeft: 10,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'stretch',
    padding: 20,
    paddingTop: 0,
  },
  dimmer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmerButton: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#D8D8D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunglass: {
    width: 60, height: 60,
  },
  dimmerText: {
    flex: 1,
  },
  timer: {
  },
  timerType: {
  },
  hours: {
    flexDirection: 'row',
    margin: 20,
  },
  hour: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  light: {
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
  sensors: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  days: {
    marginTop: 20, marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(Device)
