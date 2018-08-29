import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { View, Picker, Text, Image, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { withBLECharacteristics } from '../utils/ble.js'
import { Creators } from '../actions/ble'

import textStyles from './TextStyles'
import Separator from './Separator'
import BigButton from './BigButton'
import SetupLayout, { setupStyles } from './SetupLayout'

import sunrise from './assets/images/sunrise.png'
import sunset from './assets/images/sunset.png'
import edit from './assets/images/edit.png'

class ParamEditor extends React.Component {

  state = {value: null}

  render() {
    const { value } = this.state
    const { title, icon, value: propsValue } = this.props
    return (
      <View style={layoutStyles.editorContainer}>
        <View style={layoutStyles.editorTitle}>
          <Image style={layoutStyles.editorPic} source={icon} />
          <Text style={[textStyles.text, textStyles.title]}>{title}</Text>
        </View>
        <View style={layoutStyles.pickerContainer}>
          <Picker
            selectedValue={value || propsValue}
            style={layoutStyles.picker}
            itemStyle={[textStyles.text, layoutStyles.pickerItems]}
            onValueChange={this._handleValueChanged}>
            {
              _.times(48, (i) => (
                <Picker.Item key={i} label={`${Math.floor(i / 2)}h${(i % 2) * 30}`} value={`${Math.floor(i / 2)}h${(i % 2) * 30}`} />
              ))
            }
          </Picker>
        </View>
        <View style={layoutStyles.next}>
          <BigButton title='Set hour' onPress={this._handleSelected} />
        </View>
      </View>
    )
  }

  _handleValueChanged = (value) => {
    this.setState({value})
  }

  _handleSelected = () => {
    const { value } = this.state
    const { onValueChanged } = this.props
    onValueChanged(value)
  }

}

class Classic extends React.Component {

  state = {editParam: null}

  renderParam(param) {
    const { device } = this.props
    const hour = device.getIn(['services', 'config', 'characteristics', `${param}Hour`, 'value'])
    const min = device.getIn(['services', 'config', 'characteristics', `${param}Min`, 'value'])

    return (
      <View style={layoutStyles.timerContainer}>
        <Image source={param == 'on' ? sunrise : sunset} />
        <Text style={[textStyles.text, textStyles.big]}>
          <Text>{param == 'on' ? 'Sunrise:' : 'Sunset:'}</Text>
          <Text>{hour}h{min}</Text>
        </Text>
        <TouchableOpacity onPress={this._handleEditParam(param)}>
          <Image source={edit} />
        </TouchableOpacity>
      </View>
    )
  }

  renderEditor() {
    const { editParam } = this.state
    const { device } = this.props
    const hour = device.getIn(['services', 'config', 'characteristics', `${editParam}Hour`, 'value'])
    const min = device.getIn(['services', 'config', 'characteristics', `${editParam}Min`, 'value'])

    return (
      <ParamEditor
        title={editParam == 'on' ? 'Sunrise time' : 'Sunset time' }
        icon={editParam == 'on' ? sunrise : sunset}
        value={`${hour}h${min}`}
        onValueChanged={this._handleParamChanged(editParam)} />
    )
  }

  renderBody() {
    const { editParam } = this.state
    if (editParam) {
      return this.renderEditor()
    }
    return (
      <View style={layoutStyles.container}>
        <Text style={setupStyles.title}>2. Classic sunrise/sunset timer</Text>
        {this.renderParam('on')}
        <Separator />
        {this.renderParam('off')}
      </View>
    )
  }

  render() {
    const { editParam } = this.state
    return (
      <SetupLayout title='Lighting setup'>
        { this.renderBody() }
        {
          !editParam && (<View style={layoutStyles.next}>
            <BigButton onPress={this._handleNext} />
          </View>)
        }
      </SetupLayout>
    )
  }

  _handleEditParam = (param) => () => {
    this.setState({editParam: param})
  }

  _handleParamChanged = (param) => (value) => {
    console.log(value)
    const { device, dispatch } = this.props
    const params = value.split('h')
    console.log(params, parseInt(params[0]), parseInt(params[1]))
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `${param}Hour`, parseInt(params[0])))
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `${param}Min`, parseInt(params[1])))
    this.setState({editParam: null})
  }

  _handleNext = () => {
    const { device, navigation } = this.props
    navigation.navigate('Done', { device: device.toJS() })
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    color: '#A7A7A7',
    textAlign: 'left',
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
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 25, marginRight: 25,
    marginBottom: 20,
  },
  value: {
    flex: 1,
  },
  next: {
    marginLeft: 20, marginRight: 20,
  },
  editorBackground: {
    position: 'absolute',
    width: '100%', height: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  editorContainer: {
    flex: 1,
    //borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  editorPic: {
  },
  editorTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    flex: 1,
    padding: 20,
  },
  picker: {
    width: '100%', height: '100%',
  },
  pickerItems: {
    fontWeight: 'bold',
    fontSize: 30,
  },
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(withBLECharacteristics(['onHour', 'onMin', 'offHour', 'offMin'])(Classic))
