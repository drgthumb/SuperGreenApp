import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import SetupLayout from './SetupLayout'

class Wait extends React.Component {

  componentWillReceiveProps(newProps) {
    const { devices, navigation, } = newProps;
    const { devices: newDevices, } = this.props;
    if (devices.size != 0 && devices.size != newDevices.size) {
      console.log(devices, ' ', devices.valueSeq());
      navigation.navigate('Device', { device: devices.valueSeq().get(0) })
    }
  }

  render() {
    return (
      <SetupLayout title='Welcome to chronic-o-matic'>
        <View style={layoutStyles.container}>
          <Text style={styles.title}>
            Looking for the new box,{"\n"}
            please ensure that it is plugged in..
          </Text>
          <ActivityIndicator size="large" />
        </View>
      </SetupLayout>
    )
  }

}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    color: '#A7A7A7',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
});

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
})

const mapStateToProps = (state, props) => ({
  devices: state.getIn(['ble', 'devices']),
})

export default connect(mapStateToProps)(Wait)
