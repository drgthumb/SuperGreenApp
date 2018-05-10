import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TextInput, Button } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

class SetupScreen extends React.Component {

  componentDidMount() {
    const { dispatch, device } = this.props
    //dispatch(Creators.scan(device.get('name')))
  }

  render() {
    const { wifis } = this.props
    return (<Text>lol</Text>);
      /*return (
      <View>
        <Text>Wifi configuration</Text>
        {
          wifis.map(name => (
            <View key={name}>
              <Text>{name}</Text>
              <Button title="See" onPress={() => this._handleWifiSelected(name)} />
            </View>
          ))
        }
      </View>
    )*/
  }

  _handleWifiSelected = (ssid) => {
    console.log(ssid)
  }

}

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').name]),
  wifis: state.getIn(['ble', 'devices', props.navigation.getParam('device').name, 'services', 'wifi', 'characteristics', 'foundWifi', 'value']),
})

export default connect(mapStateToProps)(SetupScreen)
