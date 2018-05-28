import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import Icon from 'react-native-vector-icons/Octicons';

export class NumberPicker extends React.Component {

  render() {
    const { value, min, max, step, onValueChanged, style } = this.props

    return (
      <View style={[layoutStyles.container, layoutStyles.numberContainer, style]}>
        <Text style={layoutStyles.number}>{value < 10 ? '0' : Math.floor(value / 10)}</Text>
        <Text style={layoutStyles.number}>{value % 10}</Text>
        <View style={layoutStyles.buttons}>
          <TouchableOpacity
            onPress={() => onValueChanged((value + step > max) ? min : (value + step))}>
            <Icon name='chevron-up' size={30} color='#4F8EF7' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onValueChanged((value - step < min) ? max : (value - step))}>
            <Icon name='chevron-down' size={30} color='#4F8EF7' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  numberContainer: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  number: {
    flex: 0.5,
    fontSize: 50,
    textAlign: 'center',
  },
  buttons: {
  },
  center: {
    alignItems: 'center',
  },
});
