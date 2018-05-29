import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import DeviceList from '../components/DeviceList';
import Device from '../components/Device';
import Wait from '../components/Wait';
import Wifi from '../components/Wifi';
import SelfTest from '../components/SelfTest';
import Lighting from '../components/Lighting';
import TimerType from '../components/TimerType';
import Classic from '../components/Classic';
import Season from '../components/Season';
import { addListener } from '../utils/redux';

export const AppNavigator = createSwitchNavigator({
  Wait,
  InitialSetup: createStackNavigator({
    Wifi,
    SelfTest,
    Lighting,
    TimerType,
    Classic,
    Season,
  }, {
    headerMode: 'none',
    initialRouteName: 'Wifi',
  }),
  Home: createStackNavigator({
    Device,
  }),
});

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={{
          dispatch,
          state: nav.toJS(),
          addListener,
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.get('nav'),
});

export default connect(mapStateToProps)(AppWithNavigationState);
