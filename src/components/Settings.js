import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

class Settings extends React.Component {

  render() {
    const { device } = this.props
    return (
      <View style={layoutStyles.container}>
        <Text>Settings</Text>
        <ScrollView style={layoutStyles.container}>
        {
          device.getIn(['services', 'config', 'characteristics']).map((v, k) => (
            <Text key={k}>{k} : {v.get('value')}</Text>
          ))
        }
        </ScrollView>
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

export default connect(mapStateToProps)(Settings)
