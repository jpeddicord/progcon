import React from 'react';
import { connect } from 'react-redux';
import { fetchContestDetail, updateContest } from '../modules/contests';

class ContestEditor extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    dispatch: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    active: React.PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, active, params: { contest_id } } = this.props;
    if (active == null || active.id !== parseInt(contest_id)) {
      dispatch(fetchContestDetail(contest_id));
    }
  }

  saveContest = e => {
    const { dispatch, active } = this.props;
    const fields = e.target.elements;
    e.preventDefault();

    function nully(v) {
      if (v.length === 0) {
        return null;
      }
      return v;
    }

    dispatch(updateContest(active.id, {
      title: nully(fields.title.value),
      start_time: nully(fields.start_time.value),
      end_time: nully(fields.end_time.value),
      mode: fields.mode.value,
      code: nully(fields.code.value),
      problems: fields.problems.value.trim().split('\n'),
    }));
  };

  render() {
    const { active, params: { contest_id } } = this.props;

    if (active == null || active.id !== parseInt(contest_id)) {
      return <div/>;
    }

    console.log(active);

    return (
      <form onSubmit={this.saveContest}>
        title: <input name="title" type="text" defaultValue={active.title} /><br/>
        start time: <input name="start_time" type="datetime-local" defaultValue={active.start_time} /><br/>
        end time: <input name="end_time" type="datetime-local" defaultValue={active.end_time} /><br/>
        reg mode: <select disabled name="mode" defaultValue={active.mode}><option value="code">registration code</option></select><br/>
        reg code: <input name="code" type="text" defaultValue={active.code} /><br/>
        problems: <textarea name="problems" defaultValue={active.problems.join('\n')} /><br/>
        <button type="submit">save</button>
      </form>
    );
  }

}

export default connect(state => {
  return {
    active: state.contests.active,
  };
})(ContestEditor);
