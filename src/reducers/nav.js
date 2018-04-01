import { fromJS } from 'immutable';
import { NavigationActions } from 'react-navigation'
import { AppNavigator } from '../navigators/AppNavigator'

const initialState = fromJS(AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('List')
))

function nav(state = initialState, action) {
  let nextState
  switch (action.type) {
    default:
      nextState = fromJS(AppNavigator.router.getStateForAction(action, state.toJS()))
      break
  }

  return nextState || state
}

export default nav
