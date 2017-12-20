import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import Home from './reducers/Home';
import user from './reducers/User';

export default combineReducers({
  routing,
  Home,
  user,
});
