import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';

import rootReducer from '../reducer';

let middlewares = [thunk, promiseMiddleware]

const enhancer = compose(
  applyMiddleware(...middlewares)
)(createStore);

export default function configureStore(initialState) {
  return enhancer(rootReducer, initialState);
}
