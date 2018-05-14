import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

class Device extends React.Component {

  state = {nav: 'status'}

  componentDidMount() {
    const { dispatch, device } = this.props
  }

  render() {
    const { device, wifis } = this.props
    return (
      <View style={layoutStyles.container}>
        <View style={layoutStyles.mainStatus}>
          <Text style={mainStatusStyles.firstStart}>First start</Text>
        </View>
        <View style={layoutStyles.nav}>
          <View style={navStyles.bgLine}></View>
          <TouchableOpacity style={navStyles.navItemWrapper} onPress={() => this._handleNavPress('status')}>
            <View style={[navStyles.navItem, this.state.nav == 'status' && navStyles.navItemSelected]}>
              <Text>status</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={navStyles.navItemWrapper} onPress={() => this._handleNavPress('light')}>
            <View style={[navStyles.navItem, this.state.nav == 'light' && navStyles.navItemSelected]}>
              <Text>light</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={navStyles.navItemWrapper} onPress={() => this._handleNavPress('settings')}>
            <View style={[navStyles.navItem, this.state.nav == 'settings' && navStyles.navItemSelected]}>
              <Text>settings</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={layoutStyles.content}>
          <Text>{this.state.nav}</Text>
        </View>
      </View>
    );
  }

  _handleNavPress = (nav) => {
    this.setState({nav});
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainStatus: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});

const mainStatusStyles = StyleSheet.create({
  firstStart: {
    fontSize: 25,
  },
});

const navStyles = StyleSheet.create({
  navItemWrapper: {
    width: '20%',
    margin: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efefef',
    padding: 10,
    borderRadius: 50,
  },
  navItemSelected: {
    backgroundColor: 'grey',
  },
  bgLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#efefef',
  },
});

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').name]),
  wifis: state.getIn(['ble', 'devices', props.navigation.getParam('device').name, 'services', 'wifi', 'characteristics', 'foundWifi', 'value']),
})

export default connect(mapStateToProps)(Device)
