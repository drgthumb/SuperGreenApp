import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';

import DeviceList from '../components/DeviceList';
import SetupScreen from '../components/SetupScreen';
import { addListener } from '../utils/redux';

export const AppNavigator = StackNavigator({
  List: { screen: DeviceList },
  Device: { 
    screen: StackNavigator({
      Setup: { screen: SetupScreen },
    })
  },
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
        navigation={addNavigationHelpers({
          dispatch,
          state: nav.toJS(),
          addListener,
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.get('nav'),
});

export default connect(mapStateToProps)(AppWithNavigationState);
