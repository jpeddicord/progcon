/* global __BUILD */
import React from 'react';
import StatusNav from '../containers/StatusNav';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
  };

  render() {
    return (
      <div>
        <StatusNav />

        <br/>

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {this.props.children}
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
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
