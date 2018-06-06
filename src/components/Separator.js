import React from 'react'
import { View, Text, StyleSheet, Image, } from 'react-native'

import separator from './assets/images/separator.png'

export default class Separator extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={separator} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    margin: 20,
    marginLeft: 10, marginRight: 10,
  }
})
