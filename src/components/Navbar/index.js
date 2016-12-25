import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import './style.scss';

import LoggedIndicator from './LoggedIndicator.js';

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="container">
          <a href="https://www.crowded.com/" className="navbar-brand">
            <img src={require('../../assets/images/cr_logo_ darkgray_blue.png')} height="20" style={{marginBottom: '10px'}}/>
          </a>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link disabled" href="#">Lists</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#">Jobs</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#">Find Candidates</a>
              </li>
              <li className="nav-item active has-dropdown">
                <Link to="#" className="nav-link">Candidate Insights</Link>
                <ul className="dropdown-content">
                  <li className="dropdown-item">
                    <Link to={"/candidate-insight/candidates"}>Candidates</Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to={"/candidate-insight/jobs"}>Jobs</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="/sub1/public_html/candidate_recommendations/src/index.php" className="nav-link disabled">Candidate Recommendations</a>
              </li>
            </ul>
          </div>
          <LoggedIndicator />
        </div>
      </nav>
    )
  }
}

// const mapStateToProps = (state, ownProps) => {
//   return {
//     routing: state.routing,
//   }
// }
//
// export default connect(
//   mapStateToProps
// )(Navbar)

export default Navbar;
