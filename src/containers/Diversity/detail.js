import React from 'react';

import Graph from '../../components/Visualisation/Graph';
import Card from '../../components/Card';
import AppLayout from '../../layouts';
import DiversityMenu from './menu';

const data = {
  websites: require('./div_websiteJSON.json'),
  influences: require('./div_influencersJSON.json'),
  interests: require('./div_interestsJSON.json'),
  brands: require('./div_brandsJSON.json'),
  "tv-networks": require('./div_tvnetJSON.json'),
  "tv-shows": require('./div_tvshowJSON.json'),
  "personality-traits": require('./div_personalityJSON.json'),
  ethnicity: require('./demo_ethnicityJSON.json'),
  gender: require('./demo_genderJSON.json'),
  age: require('./demo_ageJSON.json')
}

class DiversityDetail extends React.Component {

  getLabel(label) {
    return this.capitalize(label.replace('-', ' '));
  }

  capitalize(str) {
    return str.toLowerCase().replace(/([^a-z]|^)([a-z])(?=[a-z]{1})/g, function(_, g1, g2) {
      return g1 + g2.toUpperCase();
    });
  }

  renderContent() {
    const {detail} = this.props.match.params;

    if (!detail) return null;

    if (detail === 'demographics') {
      return <DiversityMenu {...this.props} />
    }

    const enableToggleRatio = ['gender', 'age', 'ethnicity'].indexOf(detail) !== -1;

    return (
      <div className="col-sm-12">
        <Card title={this.getLabel(detail)} {...this.props}>
          <Graph data={data[detail]} selectedValue="Design" {...this.props} enableToggleRatio={enableToggleRatio} />
        </Card>
      </div>
    )
  }

  render() {
    return (
      <AppLayout>
        <div className="row">
          { this.renderContent() }
        </div>
      </AppLayout>
    )
  }
}

export default DiversityDetail;