import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import Manual from './TimerManual'
import OnOff from './TimerOnOff'
import Season from './TimerSeason'

const COMPONENTS = [Manual, OnOff, Season];

class Timer extends React.Component {

  render() {
    const { device } = this.props
    const type = device.getIn(['services', 'config', 'characteristics', 'timerType', 'value'])
    const TimerComponent = COMPONENTS[type]

    return (
      <View style={layoutStyles.container}>
        <Text>Timer type {type}</Text>
        <Button onPress={() => this._handleTypePressed(0)} title='Manual' />
        <Button onPress={() => this._handleTypePressed(1)} title='On/off' />
        <Button onPress={() => this._handleTypePressed(2)} title='Season' />
        <View style={layoutStyles.container}>
          <TimerComponent device={device} />
        </View>
      </View>
    );
  }

  _handleTypePressed = (value) => {
    const { device } = this.props
    this.props.dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'timerType', value));
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state, props) => ({
})

export default connect(mapStateToProps)(Timer)
