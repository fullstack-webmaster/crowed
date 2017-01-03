import React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';
import Donut from '../../components/Visualisation/Donut';

import Card from '../../components/Card';
import data from './1010Data_educDonut.json';

class EducationDonut extends React.Component {
  render() {
    return (
      <Card showDropDown title={this.props.label} {...this.props}>
        <Donut data={data} />
      </Card>
    )
  }
}

export default EducationDonut;
