import React from 'react';

import Card from '../../components/Card';

import Sunburst from '../../components/Visualisation/Sunburst';
import WordCould from '../../components/Visualisation/WordCloud';
import TreeMap from '../../components/Visualisation/TreeMap';
const skillsData = require('./1010Data_skillsWCJson.json');
const prolesData = require('./1010Data_prolesWCJson.json');
const skillTM = require('./1010Data_skillsTMJson.json');

class SkillPriorRolesView extends React.Component {
  renderContent() {
    const {match} = this.props;

    switch(match.params.type) {
      case 'skill-word-cloud':
        return (
          <Card showDropDown showHiredLegend showHiredDropDown title="Skills (Word Cloud)" {...this.props}>
            <WordCould data={skillsData}/>
          </Card>
        )
      case 'skill-treemap':
        return (
          <Card showDropDown showHiredDropDown title="Skills (Treemap)" {...this.props}>
            <TreeMap data={skillTM}/>
          </Card>
        )
      case 'prior-roles':
        if (this.props.history.action === 'PUSH') {
          window.location.reload();
          return (
            <Card showDropDown showHiredDropDown title="Prior Roles" {...this.props}>
            </Card>
          )
        }

        return (
          <Card showHiredLegend showDropDown showHiredDropDown title="Prior Roles" {...this.props}>
            <WordCould data={prolesData}/>
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

export default SkillPriorRolesView;
