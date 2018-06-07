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
import wait from './assets/images/wait.png'

const MONTH_NAME = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

class ParamEditor extends React.Component {

  state = {value: null}

  render() {
    const { value } = this.state
    const { title, submit, icon, value: propsValue, items } = this.props
    return (
      <View style={layoutStyles.editorContainer}>
        <View style={layoutStyles.editorTitle}>
          <Image style={layoutStyles.editorPic} source={icon} />
          <Text style={[textStyles.text, textStyles.title]}>{' '}{title}</Text>
        </View>
        <View style={layoutStyles.pickerContainer}>
          <Picker
            selectedValue={value || propsValue}
            style={layoutStyles.picker}
            itemStyle={[textStyles.text, layoutStyles.pickerItems]}
            onValueChange={this._handleValueChanged}>
            {
              _.map(items, (item, i) => (
                <Picker.Item key={i} {...item} />
              ))
            }
          </Picker>
        </View>
        <View style={layoutStyles.next}>
          <BigButton title={submit} onPress={this._handleSelected} />
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

    this.state = {editParam: null, editDuration: false, startDateMonth: sd.getMonth() + 1, startDateDay: sd.getDate(), endDateMonth: ed.getMonth() + 1, endDateDay: ed.getDate()}
  }

  renderParam(param) {
    const startDateMonth = this.state[`${param}DateMonth`]
    const startDateDay = this.state[`${param}DateDay`]

    return (
      <View style={layoutStyles.timerContainer}>
        <Text style={[textStyles.text, textStyles.big]}>{param == 'start' ? 'From:' : 'To:'}</Text>
        <View style={layoutStyles.paramValue}>
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

  renderDateEditor(editParam) {
    const dateMonth = this.state[`${editParam}DateMonth`]
    const dateDay = this.state[`${editParam}DateDay`]
    const items = _.times(48, (i) => ({label:`${MONTH_NAME[Math.floor(i / 4)]} ${Math.max(1, (i % 4) * 7)}`, value: `${MONTH_NAME[Math.floor(i / 4)]} ${Math.max(1, (i % 4) * 7)}`}))
    return (
      <ParamEditor
        title={editParam == 'start' ? 'Simulated start date' : 'Simulated end date' }
        submit='Set date'
        icon={calendar}
        value={`${MONTH_NAME[dateMonth - 1]} ${dateDay}`}
        onValueChanged={this._handleDateChanged(editParam)}
        items={items} />
    )
  }

  renderDurationEditor() {
    const { device } = this.props
    const durationDays = device.getIn(['services', 'config', 'characteristics', `durationDays`, 'value'])
    const items = _.times(240, (i) => ({label:`${i} days`, value: i}))

    return (
      <ParamEditor
        title='Simulation duration'
        submit='Set duration'
        icon={wait}
        value={durationDays}
        onValueChanged={this._handleDurationChanged}
        items={items} />
    )
  }

  renderDuration() {
    const { device } = this.props
    const durationDays = device.getIn(['services', 'config', 'characteristics', `durationDays`, 'value'])

    return (
      <View style={layoutStyles.durationContainer}>
        <Text style={[textStyles.text, textStyles.big]}>Duration</Text>
        <View style={layoutStyles.paramValue}>
          <Image source={wait} />
          <Text style={[textStyles.text, textStyles.big]}>
            {' '}{durationDays} days
          </Text>
        </View>
        <TouchableOpacity onPress={this._handleEditDuration}>
          <Image source={edit} />
        </TouchableOpacity>
      </View>
    )
  }

  renderBody() {
    const { editParam, editDuration } = this.state
    if (editDuration) {
      return this.renderDurationEditor()
    }
    if (editParam) {
      return this.renderDateEditor(editParam)
    }
    return (
      <View style={layoutStyles.container}>
        <Text style={setupStyles.title}>2. Season sunrise/sunset timer</Text>
        {this.renderParam('start')}
        <Separator />
        {this.renderParam('end')}
        {this.renderDuration()}
      </View>
    )
  }

  render() {
    const { editParam, editDuration } = this.state
    return (
      <SetupLayout title='Lighting setup'>
        { this.renderBody() }
        {
          !editParam && !editDuration && (<View style={layoutStyles.next}>
            <BigButton onPress={this._handleNext} />
          </View>)
        }
      </SetupLayout>
    )
  }

  _handleEditParam = (param) => () => {
    this.setState({editParam: param})
  }

  _handleEditDuration = () => {
    this.setState({editDuration: true})
  }

  _handleDateChanged = (param) => (value) => {
    const { device, dispatch } = this.props
    const params = value.split(' ')

    const state = this.state
    state[`${param}DateMonth`] = MONTH_NAME.indexOf(params[0]) + 1
    state[`${param}DateDay`] = parseInt(params[1])
    this.setState(state)

    const { startDateMonth, startDateDay, endDateMonth, endDateDay } = state
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'startDateMonth', startDateMonth))
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'startDateDay', startDateDay))

    const sd = new Date(`${startDateMonth}/${startDateDay}`)
    const ed = new Date(`${endDateMonth}/${endDateDay}`)
    const timeDiff = Math.abs(ed.getTime() - sd.getTime()),
          durationDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'durationDays', durationDays))

    this.setState({editParam: null})
  }

  _handleDurationChanged = (value) => {
    const { device, dispatch } = this.props
    dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', `durationDays`, value))
    this.setState({editDuration: false})
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
  paramValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  next: {
    marginTop: 10,
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
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 25,
    padding: 10,

    borderWidth: 1,
    borderColor: '#979797',
    borderRadius: 10,
  },
})

const mapStateToProps = (state, props) => ({
  device: state.getIn(['ble', 'devices', props.navigation.getParam('device').id]),
})

export default connect(mapStateToProps)(Season)
