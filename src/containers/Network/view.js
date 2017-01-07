import React from 'react';

import Card from '../../components/Card';
import ForceDirectedGraph from '../../components/Visualisation/ForceDirectedGraph';

class NetworkView extends React.Component {
  renderContent() {
    const {match} = this.props;

    switch(match.params.type) {
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

export default NetworkView;
