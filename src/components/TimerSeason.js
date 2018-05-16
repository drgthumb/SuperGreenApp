import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

class Season extends React.Component {

  render() {
    const { device } = this.props
    return (
      <View style={layoutStyles.container}>
        <Text>Season</Text>
      </View>
    );
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state, props) => ({
})

export default connect(mapStateToProps)(Season)
