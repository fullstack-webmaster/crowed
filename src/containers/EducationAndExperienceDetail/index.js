import React from 'react';

import Card from '../../components/Card';
import Sunburst from '../../components/Visualisation/Sunburst';
const treeYE = require('./1010Data_treeYE.json');
const treeSch = require('./treeSch_v4.json');

class EducationAndExperienceDetail extends React.Component {
  renderContent() {
    const {match} = this.props;

    switch(match.params.type) {
      case 'years-of-experience':
        return (
          <Card showDropDown title={this.props.label} {...this.props}>
            <Sunburst data={treeYE} label="flname"/>
          </Card>
        )
      // case 'education':
      //   return (
      //     <Card title="Candidates by Education" {...this.props}>
      //       <Sunburst data={require('./treeED.json')} label="flname"/>
      //     </Card>
      //   )
      case 'school':
        return (
          <Card showDropDown title={this.props.label} {...this.props}>
            <Sunburst data={treeSch} label="flname" school/>
          </Card>
        )
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          { this.renderContent() }
        </div>
      </div>
    )
  }
}

export default EducationAndExperienceDetail;
