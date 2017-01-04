import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import AppLayout from '../../layouts';

import InsightLogin from './InsightLogin.js';
import InsightCategories from './InsightCategories.js';

import './style.scss';

/**
 * Insight
 */
class InsightCandidates extends React.Component {
  state = {
    categories: [{
      label: 'Experience',
      url: 'education-and-experience',
      img: 'education_and_experience.png',
    }, {
      label: 'Skills & Prior Roles',
      url: 'skills-and-prior-roles',
      img: 'skills_and_prior_roles.png',
    }, {
      label: 'Prior Companies',
      url: 'previous-company',
      img: 'previous companies.png',
    }, {
      label: 'Geography',
      url: 'geography',
      img: 'geography.png',
    }, {
      label: 'Network',
      url: 'network',
      img: 'network2.png'
    }],
  }
  render() {
    const {
      user,
      match,
    } = this.props;

    if (!user) {
      return (
        <AppLayout>
          <Route path={match.url} component={InsightLogin}/>
        </AppLayout>
      );
    }

    return (
      <div>
        <Route exact path={match.url} component={InsightCategories}/>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user,
}))(InsightCandidates);
