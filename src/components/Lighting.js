import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import SetupLayout from './SetupLayout'

class Lighting extends React.Component {

  state = {selectedTimer: -1}

  render() {
    const { submitted } = this.state
    return (
      <SetupLayout title='Lighting setup'>
        <Text>Lighting</Text>
        <View style={layoutStyles.container}>
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
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 40,
  },
})

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    margin: 25,
  },
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(Lighting)
