import React from 'react';

import Card from '../../components/Card';
import Sunburst from '../../components/Visualisation/Sunburst';
const treeYE = require('./../EducationAndExperienceDetail/1010Data_treeYE.json');

class EducationAndExperience extends React.Component {
  state = {
    data: [{
      label: 'Years of Experience',
      url: 'years-of-experience',
      img: 'yearsExp.png'
    }, {
      label: 'School',
      url: 'school',
      img: 'school.png'
    }],
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <Card showDropDown title="Candidate Data" {...this.props}>
            <Sunburst data={treeYE} label="flname"/>
          </Card>
        </div>
      </div>
    )
  }
}

export default EducationAndExperience
