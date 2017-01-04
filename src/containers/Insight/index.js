import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import AppLayout from '../../layouts';

import InsightLogin from './InsightLogin.js';
import InsightCandidates from './InsightCandidates';
import InsightJobs from './InsightJobs';

import EducationAndExperience from '../EducationAndExperience';
import EducationAndExperienceDetail from '../EducationAndExperienceDetail';
import SkillPriorRoles, {SkillPriorRolesView} from '../SkillPriorRoles';
import PreviousCompany, {PreviousCompanyView} from '../PreviousCompany';
import Geography from '../Geography';
import Network, {NetworkView} from '../Network';
import EducationDonut from '../EducationDonut';

/**
 * Insight
 */
class Insight extends React.Component {

  render() {
    const {
      match,
      user,
    } = this.props;

    if (!user) {
      return (
        <AppLayout>
          <Route path={match.url} component={InsightLogin}/>
        </AppLayout>
      );
    }

    return (
      <AppLayout>
        <Route exact path={`${match.url}/candidates`} component={InsightCandidates}/>
        <Route exact path={`${match.url}/candidates/education-and-experience`} component={EducationAndExperience}></Route>
        <Route exact path={`${match.url}/candidates/education-and-experience/:type`} component={EducationAndExperienceDetail}/>
        <Route exact path={`${match.url}/candidates/skills-and-prior-roles`} component={SkillPriorRoles}></Route>
        <Route exact path={`${match.url}/candidates/skills-and-prior-roles/:type`} component={SkillPriorRolesView}></Route>
        <Route exact path={`${match.url}/candidates/previous-company`} component={PreviousCompany}></Route>
        <Route exact path={`${match.url}/candidates/previous-company/:type`} component={PreviousCompanyView}></Route>
        <Route exact path={`${match.url}/candidates/geography`} component={Geography}></Route>
        <Route exact path={`${match.url}/candidates/network`} component={Network}></Route>
        <Route exact path={`${match.url}/candidates/network/:type`} component={NetworkView}></Route>
        <Route exact path={`${match.url}/candidates/education-donut`} component={EducationDonut}></Route>

        <Route exact path={`${match.url}/jobs`} component={InsightJobs}/>
      </AppLayout>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
  })
)(Insight);
