import React from 'react';

import Card from '../../components/Card';
import ForceDirectedGraph from '../../components/Visualisation/ForceDirectedGraph';
const forceD_region_v2 = require('./1010Data_forceD_region.json');

class Network extends React.Component {
  state = {
    data: [{
      label: 'Region',
      url: 'state-city',
      img: 'state_city.png',
    }],
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <Card title="Region" showDropDown {...this.props}>
            <ForceDirectedGraph data={forceD_region_v2} selectedValue="Design"/>
          </Card>
        </div>
      </div>
    )
  }
}

export default Network;
export {default as NetworkView} from './view';
