import React from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import logo from './assets/images/logo.png'

class SetupLayout extends React.Component {

  render() {
    const { title, children } = this.props
    return (
      <View style={layoutStyles.container}>
        <View style={layoutStyles.top}>
          <Image
            style={styles.logo}
            source={logo}
          />
          <Text style={styles.title}>{ title }</Text>
        </View>
        <View style={layoutStyles.body}>
          { children }
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    margin: 30,
  }
});

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
})

const mapStateToProps = (state, props) => ({
  devices: state.getIn(['ble', 'devices']),
})

export default connect(mapStateToProps)(SetupLayout)
