import React from 'react';

import Card, {CardItem} from '../../components/Card';

class SkillPriorRoles extends React.Component {
  state = {
    data: [{
      label: 'Skills (Word Cloud)',
      url: 'skill-word-cloud',
      img: 'submenu_skills.png'
    }, {
      label: 'Skills (Tree Map)',
      url: 'skill-treemap',
      img: 'submenu_prev_companies_by_exp.png'
    }, {
      label: 'Prior Roles',
      url: 'prior-roles',
      img: 'submenu_prior_roles.png'
    }],
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-10 offset-sm-1">
          <Card title="Skills and Prior Roles" {...this.props}>
            <CardItem data={this.state.data} {...this.props} />
          </Card>
        </div>
      </div>
    )
  }
}

export default SkillPriorRoles;
export {default as SkillPriorRolesView} from './view';
