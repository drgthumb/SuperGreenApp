import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class BigButton extends React.Component {

  render() {
    const { title, onPress, disabled, style } = this.props
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.container, disabled && styles.disabled, style]}>
        <Text style={styles.label}>{title || 'Ok'}</Text>
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderColor: '#B3DFBF',
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  disabled: {
    backgroundColor: 'grey',
  },
  label: {
    fontFamily: 'HelveticaNeue',
    fontSize: 23,
  },
})
