const initialState = JSON.parse(localStorage.getItem('user'));

import * as actions from '../actions';

export default function userReducer(state = initialState, action) {
  switch (action.type) {

  case actions.LOGIN: {
    return action.payload.user;
  }

  case actions.LOGOUT: {
    return null;
  }

  default:
    return state;
  }
}
