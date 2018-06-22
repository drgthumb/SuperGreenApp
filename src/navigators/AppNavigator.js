import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'

import list from '../components/assets/images/list.png'

import DeviceList from '../components/DeviceList'
import Device from '../components/Device'
import Wait from '../components/Wait'
import Wifi from '../components/Wifi'
import SelfTest from '../components/SelfTest'
import Lighting from '../components/Lighting'
import Classic from '../components/Classic'
import Season from '../components/Season'
import { addListener } from '../utils/redux'

export const AppNavigator = createSwitchNavigator({
  Wait,
  InitialSetup: createStackNavigator({
    Wifi,
    SelfTest,
    Lighting,
    Classic,
    Season,
  }, {
    headerMode: 'none',
    initialRouteName: 'Wifi',
  }),
  Home: createStackNavigator({
    Device,
  }, {
    headerMode: 'none',
  }),
  DeviceList,
})

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  }

  render() {
    const { dispatch, nav, devices } = this.props

    return (
      <View style={{flex: 1}}>
        <AppNavigator
          navigation={{
            dispatch,
            state: nav.toJS(),
            addListener,
          }}
        />
        { devices && devices.size > 1 && (
          <TouchableOpacity style={{position: 'absolute', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: 80, height: 100, top: -20, right: -20, paddingTop: 30, paddingRight: 10, borderRadius: 20, borderWidth: 1}} onPress={this._handleShowList}>
            <Image source={list} />
          </TouchableOpacity>
        ) }
      </View>
    )
  }

  _handleShowList = () => {
    const { dispatch, nav, devices } = this.props
    console.log('_handleShowList')
    dispatch(AppNavigator.router.getActionForPathAndParams('DeviceList'))
  }
}

const styles = StyleSheet.create({
  listBackground: {
    position: 'absolute',
    width: '100%', height: '100%',
    top: 0, left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
})

const mapStateToProps = state => ({
  nav: state.get('nav'),
  devices: state.getIn(['ble', 'devices']),
})

export default connect(mapStateToProps)(AppWithNavigationState)
