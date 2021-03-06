import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import routes from './routes';

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

const Root = ({ store, history }) => {
  let ComponentEl = (
    <Provider store={store}>
      <BrowserRouter history={history}>
        { routes }
      </BrowserRouter>
    </Provider>
  );

  if (__DEV__) {
    const DevTools = require('./devTools').default;
  
    ComponentEl = (
      <Provider store={store}>
        <div>
          <BrowserRouter history={history}>
            { routes }
          </BrowserRouter>
          {!window.devToolsExtension ? <DevTools /> : null}
        </div>
      </Provider>
    );
  }

  return ComponentEl;
};

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default Root;
