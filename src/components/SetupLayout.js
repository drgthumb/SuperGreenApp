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

export const setupStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    color: '#A7A7A7',
    textAlign: 'left',
    margin: 20,
    marginTop: 30,
    marginBottom: 40,
  },
})

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  top: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 0.8,
  },
})

const mapStateToProps = (state, props) => ({
  devices: state.getIn(['ble', 'devices']),
})

export default connect(mapStateToProps)(SetupLayout)
