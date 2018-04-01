import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from 'react-native'
import { connect } from 'react-redux';
import { Creators } from '../actions/ble'

class DeviceList extends React.Component {

  render() {
    const { dispatch, devices } = this.props
    const keys = devices.keySeq().toArray().sort()
    console.log(keys)
    return (
      <View>
        {
          keys.map(key => (
            <View key={key}>
              <Text>{devices.getIn([key, 'name'])}</Text>
              <Button title="See" onPress={() => this._handleDeviceSelected(devices.get(key))} />
            </View>
          ))
        }
      </View>
    );
  }

  _handleDeviceSelected = (device) => {
    const { dispatch } = this.props;
    dispatch(Creators.scan(device.get('name')))
  }

}

const mapStateToProps = state => ({
  devices: state.getIn(['ble', 'devices']),
});

export default connect(mapStateToProps)(DeviceList);
