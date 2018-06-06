import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { View, Picker, Text, Image, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import textStyles from './TextStyles'
import Separator from './Separator'
import BigButton from './BigButton'
import SetupLayout, { setupStyles } from './SetupLayout'

import sunrise from './assets/images/sunrise.png'
import sunset from './assets/images/sunset.png'
import edit from './assets/images/edit.png'
import calendar from './assets/images/calendar.png'

const MONTH_NAME = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

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

class Season extends React.Component {


  constructor(props) {
    super(props)

    const { device } = props
    const startDateDay = device.getIn(['services', 'config', 'characteristics', `startDateDay`, 'value'])
    const startDateMonth = device.getIn(['services', 'config', 'characteristics', `startDateMonth`, 'value'])
    const durationDays = device.getIn(['services', 'config', 'characteristics', `durationDays`, 'value'])

    const sd = new Date(`${startDateMonth}/${startDateDay}`)
    const ed = new Date(sd)
    ed.setDate(sd.getDate() + durationDays);

    this.state = {editParam: null, startDateMonth: sd.getMonth() + 1, startDateDay: sd.getDate(), endDateMonth: ed.getMonth() + 1, endDateDay: ed.getDate()}
  }

  renderParam(param) {
    const { device } = this.props
    const startDateMonth = this.state[`${param}DateMonth`]
    const startDateDay = this.state[`${param}DateDay`]

    return (
      <View style={layoutStyles.timerContainer}>
        <Text style={[textStyles.text, textStyles.big]}>{param == 'start' ? 'From:' : 'To:'}</Text>
        <View style={styles.calendar}>
          <Image source={calendar} />
          <Text style={[textStyles.text, textStyles.big]}>
            {' '}{MONTH_NAME[startDateMonth-1]} {startDateDay}
          </Text>
        </View>
        <TouchableOpacity onPress={this._handleEditParam(param)}>
          <Image source={edit} />
        </TouchableOpacity>
      </View>
    )
  }

  renderEditor() {
    const { editParam } = this.state
    const { device } = this.props
    const startDateMonth = this.state[`${editParam}DateMonth`]
    const startDateDay = this.state[`${editParam}DateDay`]

    return (
      <ParamEditor
        title={editParam == 'start' ? 'Sunrise time' : 'Sunset time' }
        icon={editParam == 'start' ? sunrise : sunset}
        value={`${startDateMonth}h${startDateDay}`}
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
        <Text style={setupStyles.title}>2. Season sunrise/sunset timer</Text>
        {this.renderParam('start')}
        <Separator />
        {this.renderParam('end')}
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
    console.log('_handleParamChanged', param, value)
    /*
      const { device, dispatch } = this.props
      const params = value.split('h')
      dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `${param}Hour`, parseInt(params[0])))
      dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `${param}Min`, parseInt(params[1])))
    */
    this.setState({editParam: null})
  }

  _handleNext = () => {
    const { device, navigation } = this.props
    navigation.navigate('Device', { device: device.toJS() })
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
  calendar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

export default connect(mapStateToProps)(Season)
