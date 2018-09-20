import _ from 'lodash'
import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Picker, ScrollView, Image, Slider, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { withBLECharacteristics } from '../utils/ble.js'
import { Creators } from '../actions/ble'

import BigButton from './BigButton'

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

class ParamEditor extends React.Component {

  state = {value: null}

  render() {
    const { value } = this.state
    const { title, icon, value: propsValue } = this.props
    return (
      <View style={layoutStyles.editorContainer}>
        <View style={layoutStyles.editorTitle}>
          <Image style={layoutStyles.editorPic} source={icon} />
          <Text style={[textStyles.text, textStyles.title]}>{title}</Text>
        </View>
        <View style={layoutStyles.pickerContainer}>
          <Picker
            selectedValue={value || propsValue}
            style={layoutStyles.picker}
            itemStyle={[textStyles.text, layoutStyles.pickerItems]}
            onValueChange={this._handleValueChanged}>
            {
              _.times(48, (i) => (
                <Picker.Item key={i} label={`${Math.floor(i / 2)}h${(i % 2) * 30}`} value={`${Math.floor(i / 2)}h${(i % 2) * 30}`} />
              ))
            }
          </Picker>
        </View>
        <View style={layoutStyles.next}>
          <BigButton title='Set hour' onPress={this._handleSelected} />
        </View>
      </View>
    )
  }

  _handleValueChanged = (value) => {
    this.setState({value})
  }

  _handleSelected = () => {
    const { value } = this.state
    const { onValueChanged, value: propsValue } = this.props
    onValueChanged(value || propsValue)
  }

}

class ClassicTimer extends React.Component {

  state = {editParam: null}

  renderHours() {
    const onHour = this.props['onHour'].get('value')
    const onMin = this.props['onMin'].get('value')
    const offHour = this.props['offHour'].get('value')
    const offMin = this.props['offMin'].get('value')

    return (
      <View style={layoutStyles.hours}>
        <View style={layoutStyles.hour}>
          <Image source={sunrise} />
          <Text style={[textStyles.text, textStyles.big]}>{' '}{onHour}h{onMin}</Text>
        </View>
        <TouchableOpacity onPress={this._handleEditParam('on')}>
          <Image source={edit} />
        </TouchableOpacity>
        <View style={layoutStyles.hour}>
          <Image source={sunset} />
          <Text style={[textStyles.text, textStyles.big]}>{' '}{offHour}h{offMin}</Text>
        </View>
        <TouchableOpacity onPress={this._handleEditParam('off')}>
          <Image source={edit} />
        </TouchableOpacity>
      </View>
    )
  }

  renderEditor() {
    const { editParam } = this.state
    const hour = this.props[`${editParam}Hour`].get('value')
    const min = this.props[`${editParam}Min`].get('value')

    return (
      <ParamEditor
        title={editParam == 'on' ? 'Sunrise time' : 'Sunset time' }
        icon={editParam == 'on' ? sunrise : sunset}
        value={`${hour}h${min}`}
        onValueChanged={this._handleParamChanged(editParam)} />
    )
  }

  render() {
    const { editParam } = this.state
    const timerOutput = this.props['timerOutput'].get('value')

    return (
      <View style={layoutStyles.timerType}>
        { !editParam ? this.renderHours() : this.renderEditor() }
        <View style={layoutStyles.light}>
          <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
            Light intensity{'\n'}
            <Text style={textStyles.bigNumber}>
              {timerOutput}%
            </Text>
          </Text>
        </View>
      </View>
    )
  }

  _handleEditParam = (param) => () => {
    const { editParam } = this.state

    this.setState({editParam: param})
  }

  _handleParamChanged = (param) => (value) => {
    const { device, dispatch } = this.props
    const params = value.split('h')
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `${param}Hour`, parseInt(params[0])))
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `${param}Min`, parseInt(params[1])))
    this.setState({editParam: null})
  }
}

ClassicTimer = withBLECharacteristics(['onHour', 'onMin', 'offHour', 'offMin', 'timerOutput'])(ClassicTimer)

class LedDim extends React.Component {

  render() {
    const { onDim } = this.props
    return (
      <View style={layoutStyles.dimmer}>
        <Text style={[textStyles.text, textStyles.medium, layoutStyles.dimmerText]}>
          Dim lights by pressing this button
          before opening doors !
        </Text>
        <TouchableOpacity style={layoutStyles.dimmerButton} onPress={onDim}>
          <Image style={layoutStyles.sunglass} resizeMode='contain' source={sunglass} />
        </TouchableOpacity>
      </View>
    )
  }

}

LedDim = withBLECharacteristics(['ledDim'])(LedDim)

class Timer extends React.Component {

  renderManualTimer() {
    return (
      <View style={layoutStyles.timerType}>
        <Text style={textStyles.bigStatus}>MANUAL</Text>
      </View>
    )
  }

  renderClassicTimer() {
    return (
      <ClassicTimer {...this.props} />
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
      <View style={layoutStyles.timer}>
        <Text style={[textStyles.text, textStyles.title]}>Timer settings</Text>
        { timerType == 0 && this.renderManualTimer() }
        { timerType == 1 && this.renderClassicTimer() }
        { timerType == 2 && this.renderSeasonTimer() }
      </View>
    )
  }

}

Timer = withBLECharacteristics(['timerType'])(Timer)

class Stretch extends React.Component {

  render() {
    const { stretch } = this.props

    return (
      <View style={layoutStyles.slider}>
        <Text>off</Text>
        <Slider value={stretch.get('value')}
          minimumValue={0}
          maximumValue={100}
          minimumTrackImage={minimumTrack}
          maximumTrackImage={maximumTrack}
          thumbImage={slider}
          onSlidingComplete={this._handleStretchChanged}
          style={layoutStyles.sliderTrack} />
        <Text>max</Text>
      </View>
    )
  }

  _handleStretchChanged = (value) => {
    console.log('_handleStretchChanged', value)
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `stretch`, value))
  }
}

Stretch = withBLECharacteristics(['stretch'])(Stretch)

class Blower extends React.Component {

  render() {
    const { blower } = this.props

    return (
      <View style={layoutStyles.slider}>
        <Text>off</Text>
        <Slider value={blower.get('value')}
          minimumValue={0}
          maximumValue={100}
          minimumTrackImage={minimumTrack}
          maximumTrackImage={maximumTrack}
          thumbImage={slider}
          onSlidingComplete={this._handleBlowerChanged}
          style={layoutStyles.sliderTrack} />
        <Text>max</Text>
      </View>
    )
  }

  _handleBlowerChanged = (value) => {
    console.log('_handleBlowerChanged', value)
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `blower`, value))
  }
}

Blower = withBLECharacteristics(['blower'])(Blower)

class Device extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {nav: 'status'}

  render() {
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
          <LedDim {...this.props} onDim={this._handleDim} />
          <Separator />
          <Timer {...this.props} />
          <Separator />
          <Text style={[textStyles.text, textStyles.title]}>Stretch mode</Text>
          <Stretch {...this.props} />
          <Separator />
          <Text style={[textStyles.text, textStyles.title]}>Blower control</Text>
          <Blower {...this.props} />
          <Separator />
          <View style={layoutStyles.sensors}>
            <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
              Temp{'\n'}
              <Text style={textStyles.bigStatus}>--˚</Text>
            </Text>
            <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
              Extraction fan{'\n'}
              <Text style={textStyles.bigStatus}>--%</Text>
            </Text>
          </View>
          <View style={layoutStyles.days}>
            <Text style={[textStyles.text, textStyles.medium, textStyles.center]}>
              Happy{'\n'}
              <Text style={textStyles.bigNumber}>--<Text style={[textStyles.thin]}>rd</Text></Text> day !
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  _handleDim = () => {
    console.log('_handleDim')
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `ledDim`, parseInt(Date.now() / 1000)))
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
  pickerContainer: {
    flex: 1,
    padding: 20,
    height: 200,
  },
  picker: {
    width: '100%', height: '100%',
  },
  pickerItems: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(withBLECharacteristics(['timerType'])(Device))
