import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import AppReducer from './src/reducers'
import AppWithNavigationState from './src/navigators/AppNavigator'
import { middleware } from './src/utils/redux'
import { rootSaga } from './src/sagas';

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  }) : compose;
const store = createStore(AppReducer, composeEnhancers(applyMiddleware(sagaMiddleware, middleware)))

sagaMiddleware.run(rootSaga)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('ReduxExample', () => App)

export default App
