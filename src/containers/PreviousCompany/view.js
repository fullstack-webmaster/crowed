import React from 'react';

import Card from '../../components/Card';
import TreeMap from '../../components/Visualisation/TreeMap';
const pco_expTM = require('./1010Data_pco_expTM.json');

class PreviousCompanyView extends React.Component {
  renderContent() {
    const {match} = this.props;

    switch(match.params.type) {
      case 'years-of-experience-x-companies':
        return (
          <Card showDropDown showHiredDropDown={true} title="Companies by Years of Experience" {...this.props}>
            <TreeMap data={pco_expTM}/>
          </Card>
        )
      case 'education-level-x-companies':
        return (
          <Card showDropDown title="Companies by Education Level" {...this.props}>
            <TreeMap data={require('./pco_edTM.json')}/>
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

export default PreviousCompanyView;
