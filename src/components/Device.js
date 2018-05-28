import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

class Device extends React.Component {

  static navigationOptions = {
    headerMode: 'none',
  };

  state = {nav: 'status'}

  render() {
    const { device } = this.props
    return (
      <View style={layoutStyles.container}>
      </View>
    );
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(Device)
