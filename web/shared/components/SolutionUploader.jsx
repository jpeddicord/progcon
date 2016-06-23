import React from 'react';

export default class SolutionUploader extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
  };

  fileContent = null;
  state = {
    ready: false,
    selected: null,
    selectedSize: 0,
    error: null,
  };

  handleDrop = e => {
    e.stopPropagation();
    e.preventDefault();
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
    this.setState({ready: false, error: null});
  };

  render() {
    return (
      <div>
        <div style={{width: '200px', height: '100px', backgroundColor: '#cccccc', textAlign: 'center'}}
          onDragEnter={e => { e.stopPropagation(); e.preventDefault(); }}
          onDragOver={e => { e.stopPropagation(); e.preventDefault(); }}
          onClick={e => { this.pickerRef.click(); }}
          onDrop={this.handleDrop}>
          {this.state.selected != null ? this.state.selected : 'drop something here or click to pick'}
        </div>
        <input type="file" style={{display: 'none'}} name="picker" onChange={this.handlePicker} ref={ref => this.pickerRef = ref} />
        <button type="button" onClick={this.handleSubmit}>Upload</button>
      </div>
    );
  }

}
