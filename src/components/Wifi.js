import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import SetupLayout from './SetupLayout'

class Wifi extends React.Component {

  render() {
    const { devices } = this.props
    return (
      <SetupLayout title='Wifi setup'>
        <View style={layoutStyles.container}>
          <Text style={styles.title}>
            Looking for the new box,
            please ensure that it is plugged in..
          </Text>
          <TextInput placeholder='SSID' />
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
    margin: 40,
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

export default connect(mapStateToProps)(Wifi)
