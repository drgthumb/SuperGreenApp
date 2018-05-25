import { fromJS } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import PropTypes from 'prop-types'
import { Creators } from '../actions/ble'

import DatePicker from 'react-native-datepicker'

import { NumberPicker } from './Utils'

class Season extends React.Component {

  render() {
    const { device } = this.props
    return (
      <View style={layoutStyles.container}>
        <Text>Simulation started at</Text>
        <DatePicker
          style={{width: 200}}
          date={new Date(device.getIn(['services', 'config', 'characteristics', 'startedAt', 'value']) * 1000)}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(date) => {this.setState({date: date})}}
        />
        <Text>Simulation duration</Text>
        <NumberPicker
          value={device.getIn(['services', 'config', 'characteristics', 'simulationDurationDays', 'value'])}
          step={10} min={0} max={3000}
          onValueChanged={(value) => this._handleValueChanged('onHour', value)}
        />
        <Text>Simulated start month and day</Text>
        <NumberPicker
          value={device.getIn(['services', 'config', 'characteristics', 'startDateMonth', 'value'])}
          step={10} min={0} max={3000}
          onValueChanged={(value) => this._handleValueChanged('onHour', value)}
        />
        <NumberPicker
          value={device.getIn(['services', 'config', 'characteristics', 'startDateDay', 'value'])}
          step={10} min={0} max={3000}
          onValueChanged={(value) => this._handleValueChanged('onHour', value)}
        />
        <Text>Simulated duration in days</Text>
        <NumberPicker
          value={device.getIn(['services', 'config', 'characteristics', 'durationDays', 'value'])}
          step={10} min={0} max={3000}
          onValueChanged={(value) => this._handleValueChanged('onHour', value)}
        />
      </View>
    );
  }

  _handleStartedAt = (date) => {
    const { device } = this.props
    this.props.dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'startedAt', moment(date).unix()));
  }

  _handleSimulationDurationChanged = (value) => {
    const { device } = this.props
    this.props.dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'simulationDurationDays', value));
  }

  _handleStartDateMonthChanged = (value) => {
    const { device } = this.props
    this.props.dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'startDateMonth', value));
  }

  _handleStartDateDayChanged = (value) => {
    const { device } = this.props
    this.props.dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'startDateDay', value));
  }

  _handleDurationDaysChanged = (value) => {
    const { device } = this.props
    this.props.dispatch(Creators.setCharacteristicValue(device.get('id'), 'config', 'durationDays', value));
  }

}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state, props) => ({
})

export default connect(mapStateToProps)(Season)
