import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.get('nav').toJS(),
);
const addListener = createReduxBoundAddListener("root");

export {
  middleware,
  addListener,
};
