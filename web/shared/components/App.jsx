import React from 'react';

export default class App extends React.Component {
  render() {
    let r;
    const store = ref => {
      r = ref;
    };
    const thing = () => {
      console.log('hiya', r.textContent);
    };
    return (
      <div onClick={thing} ref={store}>Hello world.</div>
    );
  }
}
