import moment from 'moment';
import 'moment-duration-format';
import React from 'react';

export default class Timer extends React.Component {
  static propTypes = {
    startTime: React.PropTypes.object,
    format: React.PropTypes.string,
  };
  static defaultProps = {
    format: 'd[d] hh[h]:mm[m]',
  }

  state = {
    elapsed: null,
  };

  timeout = null;

  componentDidMount() {
    this.timeout = setInterval(this.updateTime, 30 * 1000);
    this.updateTime();
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  updateTime = () => {
    if (this.props.startTime == null) {
      this.setState({elapsed: null});
      return;
    }

    this.setState({
      elapsed: moment().diff(this.props.startTime, 'seconds'),
    });
  };

  render() {
    const display = moment.duration(this.state.elapsed, 'seconds').format(this.props.format);
    return (
      <span>
        {display}
      </span>
    );
  }

}
