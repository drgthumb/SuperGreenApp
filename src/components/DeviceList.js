import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Creators } from '../actions/ble'
import moment from 'moment';

class DeviceList extends React.Component {

  render() {
    const { dispatch, devices } = this.props
    const keys = devices.keySeq().toArray().sort()
    return (
      <View>
        {
          keys.map(key => (
            <TouchableOpacity key={key} activeOpacity={0.8} onPress={() => this._handleDeviceSelected(devices.get(key))}>
              <View style={styles.device}>
                <View style={styles.horizontal}>
                  <Text style={styles.name}>{devices.getIn([key, 'name'])}</Text>
                </View>
                <Text style={styles.uuid}>{devices.getIn([key, 'id'])}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
      </View>
    )
  }

  _handleDeviceSelected = (device) => {
    const { navigation } = this.props
    navigation.navigate('Device', { device })
  }
}

const styles = StyleSheet.create({
  device: {
    height: 100,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  name: {
    fontSize: 40,
  },
  time: {
    fontSize: 15,
  },
  uuid: {
    fontSize: 15,
    color: 'grey',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  devices: state.getIn(['ble', 'devices']),
})

export default connect(mapStateToProps)(DeviceList)
