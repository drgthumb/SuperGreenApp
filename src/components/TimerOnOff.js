import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import { NumberPicker } from './Utils'

class OnOff extends React.Component {

  render() {
    const { device } = this.props
    return (
      <View style={[layoutStyles.container, layoutStyles.center]}>
        <Text style={layoutStyles.title}>"On" hour</Text>
        <View style={layoutStyles.hourContainer}>
          <NumberPicker
            value={device.getIn(['services', 'config', 'characteristics', 'onHour', 'value'])}
            step={1} min={0} max={24}
            onValueChanged={(value) => this._handleValueChanged('onHour', value)}
          />
          <Text style={layoutStyles.title}>:</Text>
          <NumberPicker
            value={device.getIn(['services', 'config', 'characteristics', 'onMin', 'value'])}
            step={15} min={0} max={45}
            onValueChanged={(value) => this._handleValueChanged('onMin', value)}
          />
        </View>
        <Text style={layoutStyles.title}>"Off" hour</Text>
        <View style={layoutStyles.hourContainer}>
          <NumberPicker
            value={device.getIn(['services', 'config', 'characteristics', 'offHour', 'value'])}
            step={1} min={0} max={24}
            onValueChanged={(value) => this._handleValueChanged('offHour', value)}
          />
          <Text style={layoutStyles.title}>:</Text>
          <NumberPicker
            value={device.getIn(['services', 'config', 'characteristics', 'offMin', 'value'])}
            step={15} min={0} max={45}
            onValueChanged={(value) => this._handleValueChanged('offMin', value)}
          />
        </View>
      </View>
    );
  }

  _handleValueChanged = (key, value) => {
    const { device } = this.props
    this.props.dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', key, value));
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
  hourContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttons: {
  },
  title: {
    fontSize: 20,
  },
  center: {
    alignItems: 'center',
  },
});

const mapStateToProps = (state, props) => ({
})

export default connect(mapStateToProps)(OnOff)
