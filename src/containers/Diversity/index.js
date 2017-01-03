import React from 'react';
import {Link} from 'react-router-dom';

import AppLayout from '../../layouts';

const thumb = require('./diversityimg.png');

require('./styles.scss');

class DiversityContainer extends React.Component {
  render() {
    return (
      <AppLayout>
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <div className="card">
              <div className="card-header text-center">
                Interests
              </div>
              <div className="card-block">
                <div className="row">
                  <div className="col-sm-7">
                    <div style={{
                      border: '1px solid #ddd',
                      padding: 5,
                    }}>
                      <img className="img-fluid" src={thumb} />
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div>
                      <ul className="diversity-list">
                        {/*<li><Link to="diversity/demographics">Demographics</Link></li>*/}
                        <li><Link to="interests/brands">Brands</Link></li>
                        <li><Link to="interests/websites">Websites</Link></li>
                        <li><Link to="interests/tv-networks">TV Networks</Link></li>
                        <li><Link to="interests/tv-shows">TV Shows</Link></li>
                        <li><Link to="interests/interests">Interests</Link></li>
                        <li><Link to="interests/personality-traits">Personality Traits</Link></li>
                        <li><Link to="interests/influences">Influencers</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }
}

export {default as DiversityDetail} from './detail';

export default DiversityContainer
