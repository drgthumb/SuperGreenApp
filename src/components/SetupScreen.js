import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TextInput, Button } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

class SetupScreen extends React.Component {

  componentDidMount() {
    const { device, dispatch } = this.props
    dispatch(Creators.scan(device.get("id")))
  }

  render() {
    return (
      <View>
        <Text>LoL pouet 2</Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}} />
      </View>
    )
  }

}

export default connect()(SetupScreen)
