import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

class Status extends React.Component {

  render() {
    const { device } = this.props
    return (
      <View style={layoutStyles.container}>
        <Text>Status</Text>
        <Text>Timer type {device.getIn(['services', 'config', 'characteristics', 'timerType', 'value'])}</Text>
        <Text>Timer output {device.getIn(['services', 'config', 'characteristics', 'timerOutput', 'value'])}</Text>
        <Text>Wifi status {device.getIn(['services', 'config', 'characteristics', 'wifi_status', 'value'])}</Text>
      </View>
    );
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state, props) => ({
})

export default connect(mapStateToProps)(Status)
