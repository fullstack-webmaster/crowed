import React from 'react';
import { connect } from 'react-redux';

import { login } from '../../actions';

/**
 * InsightLogin
 */
class InsightLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: '',
    };
    this.login = this.login.bind(this);
  }
  login() {
    const username = this._username.value;
    const password = this._password.value;

    // fake auth
    if (username === 'Company' && password === 'sandbox') {
      this.props.dispatch(login(username, password));
    } else {
      this.setState({
        errorMessage: 'Invalid credentials',
      });
    }
  }
  render() {
    return (
      <div className="row insight-login">
        <div className="col-sm-10 offset-sm-1">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-block">

              <div className="login-box">
                <input
                  type="text"
                  className="username"
                  placeholder="username"
                  ref={(c) => { this._username = c; }}
                />
                <input
                  type="password"
                  className="password"
                  placeholder="password"
                  ref={(c) => { this._password = c; }}
                />
                <button
                  type="button"
                  onClick={this.login}
                >Login</button>

                {this.state.errorMessage &&
                  <div className="error-text">
                    {this.state.errorMessage}
                  </div>
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(InsightLogin);
