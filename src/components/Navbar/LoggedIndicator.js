import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../actions';

/**
 * LoggedIndicator
 */
class LoggedIndicator extends React.PureComponent {
  logOut(e) {
    e.preventDefault();
    this.props.dispatch(logout());
  }
  render() {
    let content = (
      <span>Not logged in</span>
    );
    if (this.props.user) {
      content = (
        <span>
          <span>Logged in as</span>
          <span className="username">&nbsp;{this.props.user.username}&nbsp;</span>
          <a
            href="#"
            onClick={(e) => { this.logOut(e); }}
          >[log out]</a>
        </span>
      );
    }
    return (
      <div className="logged-indicator">
        {content}
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user,
}))(LoggedIndicator);
