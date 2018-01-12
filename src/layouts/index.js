import React from 'react';
import Navbar from '../components/Navbar'

/**
 * AppLayout
 */
class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container" style={{marginTop: 30}}>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default AppLayout;
