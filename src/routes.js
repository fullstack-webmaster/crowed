import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  HashRouter,
} from 'react-router-dom';

import Home from './containers/Home';
import Insight from './containers/Insight';
import DiversityContainer, {DiversityDetail} from './containers/Diversity';

export default (
  <HashRouter basename="/">
    <div>
      <Route exact path="/" component={Home}></Route>

      <Route path="/candidate-insight" component={Insight} />

      <Route exact path="/interests" component={DiversityContainer}></Route>
      <Route exact path="/interests/:detail" component={DiversityDetail}></Route>
      <Route exact path="/interests/demographic/:detail" component={DiversityDetail}></Route>
    </div>
  </HashRouter>
);
