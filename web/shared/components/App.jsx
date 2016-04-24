import React from 'react';

export default class App extends React.Component {

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.props.children}
        </div>
      </div>
    );
  }

}
