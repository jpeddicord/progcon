import React from 'react';

const statusClasses = {
  unsubmitted: '',
  pending: 'card-inverse card-primary',
  successful: 'card-inverse card-success',
  failed_tests: 'card-inverse card-danger',
  bad_compile: 'card-inverse card-danger',
  crashed: 'card-inverse card-danger',
  timeout: 'card-inverse card-danger',
  internal_error: 'card-warning',
};

export default class SubmissionStatus extends React.Component {
  static propTypes = {
    result: React.PropTypes.string.isRequired,
    submissionTime: React.PropTypes.object.isRequired, // XXX object?
    timeScore: React.PropTypes.object.isRequired, // XXX object?
    //currentTime: React.PropTypes.object.isRequired, // XXX object?
  };

  render() {
    const { result, submissionTime, timeScore } = this.props;

    return (
      <div className={`card card-block ${statusClasses[result]}`}>
        <p className="card-text">{result} {timeScore} {submissionTime.toString()}</p>
      </div>
    );
  }
}
