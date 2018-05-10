import { fromJS } from 'immutable';
import { NavigationActions } from 'react-navigation'
import { AppNavigator } from '../navigators/AppNavigator'

const initialState = fromJS(AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('List')
))

function nav(state = initialState, action) {
  const nextState = fromJS(AppNavigator.router.getStateForAction(action, state.toJS()))
  return nextState || state
}

export default nav
