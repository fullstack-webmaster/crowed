import React from 'react';

import InsightCategory from './components/InsightCategory';

/**
 * InsightCategories
 */
class InsightCategories extends React.Component {
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
    }, {
      label: 'Education',
      url: 'education-donut',
      img: 'educationDonut.png'
    }],
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Candidate Data
            </div>
            <div className="card-block">
              {/* Content */}
              <InsightCategory data={this.state.categories} {...this.props} />
              {/* /Content */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InsightCategories;
