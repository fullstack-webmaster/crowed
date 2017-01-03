import React from 'react';
import {Link} from 'react-router-dom';
import Card, {CardItem} from '../../components/Card';

class DiversityMenu extends React.Component {
  state = {
    menus: [{
      label: 'Gender',
      data: require('./demo_genderJSON.json')
    }, {
      label: 'Ethnicity',
      data: require('./demo_ethnicityJSON.json')
    }, {
      label: 'Age',
      data: require('./demo_ageJSON.json')
    }]
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div style={{flex: 1}} className="text-center">
              <span style={{lineHeight: '35px'}} className="card-header-title">{ 'Demographics' }</span>
            </div>
          </div>
          <div className="card-block">
            <div className="row">
              { this.state.menus.map((menu) => {
                return (
                  <div className="col-md-4">
                    <Link className="menu-item" to={`demographic/${menu.label.toLowerCase()}`}>
                      <p>{ menu.label }</p>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DiversityMenu;