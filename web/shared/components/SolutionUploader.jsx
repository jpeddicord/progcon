import React from 'react';

export default class SolutionUploader extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
  };

  fileContent = null;
  state = {
    ready: false,
    selected: null,
    error: null,
  };

  handleDrop = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({dragging: false});
    this.handleFiles(e.dataTransfer.files);
  };

  handlePicker = e => {
    this.handleFiles(e.target.files);
  };

  handleFiles = files => {
    if (files.length !== 1) {
      // TODO: show a real error
      return;
    }

    const name = files[0].name;
    const reader = new FileReader();

    reader.addEventListener('load', e => {
      const content = e.target.result;
      this.fileContent = content;
      this.setState({ready: true, selected: name});
    });

    reader.addEventListener('error', err => {
      // TODO: show a real error
      console.error(err);
      this.fileContent = null;
      this.setState({ready: false, error: err});
    });

    reader.readAsText(files[0]);
  }

  handleSubmit = e => {
    const { onSubmit } = this.props;
    if (this.state.ready) {
      onSubmit(this.fileContent);
    }
    this.setState({ready: false, error: null, selected: null});
  };

  render() {
    const colorClass = this.state.ready ? 'card-info' : '';
    return (
      <div className={`card card-block ${colorClass}`}
        onDragEnter={e => { e.stopPropagation(); e.preventDefault(); }}
        onDragOver={e => { e.stopPropagation(); e.preventDefault(); }}
        onDrop={this.handleDrop}>

          <p className="card-text">
            {this.state.selected != null ? this.state.selected : 'Pick a file or drag and drop here'}
          </p>
          <input type="file" style={{display: 'none'}} name="picker" onChange={this.handlePicker} ref={ref => this.pickerRef = ref} />
          <button className="btn btn-link" type="button" onClick={e => this.pickerRef.click()}>Pick File</button>
          <button className="btn btn-warning" type="button" onClick={this.handleSubmit} disabled={!this.state.ready}>Submit</button>

      </div>
    );
  }

}
