import React from 'react';

import Card from '../../components/Card';
import LeafletMap from '../../components/Visualisation/LeafletMap';
const cpleth = require('./1010Data_cpleth.geojson');

/**
 * EducationAndExperience
 */
class Geography extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <Card title="Candidate Location" showDropDown {...this.props}>
            <LeafletMap data={cpleth} {...this.props} />
          </Card>
        </div>
      </div>
    )
  }
}

export default Geography;
