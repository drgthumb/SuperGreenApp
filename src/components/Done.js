import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import SetupLayout from './SetupLayout'
import BigButton from './BigButton'

class Done extends React.Component {

  render() {
    return (
      <SetupLayout title='Welcome to chronic-o-matic'>
        <View style={layoutStyles.container}>
          <Text style={styles.title}>
            Setup done !{"\n"}
            
          </Text>
        </View>
        <View style={layoutStyles.next}>
          <BigButton title='Start 🤖🍁' onPress={this._handleStart} />
        </View>
      </SetupLayout>
    )
  }

  _handleStart = () => {
    const { device, dispatch, navigation } = this.props
    console.log('_handleStart')
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `state`, 2))
    navigation.navigate('Device', { device: device.toJS() })
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
  next: {
    marginLeft: 20, marginRight: 20,
  },
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(Done)
