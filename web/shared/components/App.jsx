/* global __BUILD */
import React from 'react';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-full navbar-dark bg-inverse">
          <a className="navbar-brand" href="/">the programming contest</a>
          <ul className="nav navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Problems</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Leaderboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Rules</a>
            </li>
          </ul>
          <div className="form-inline pull-xs-right">
            00:00
          </div>
        </nav>

        <br/>

        <div className="container">
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-10">
              {this.props.children}
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-10">
                <small className="text-muted">
                  brought to you by <a href="https://github.com/jpeddicord/progcon">progcon v{__BUILD.version}</a> built on {__BUILD.timestamp}
                </small>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

}
