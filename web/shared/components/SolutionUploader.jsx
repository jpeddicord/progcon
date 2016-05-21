import React from 'react';

export default class SolutionUploader extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
  };

  handleDrop = e => {
    const { onSubmit } = this.props;

    e.stopPropagation();
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files.length !== 1) {
      // TODO: show a real error
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', e => {
      const content = e.target.result;
      console.log(content);
      onSubmit(content);
    });
    reader.addEventListener('error', err => {
      // TODO: show a real error
      console.error(err);
    });

    reader.readAsText(files[0]);
  };

  render() {
    const { onSubmit } = this.props;

    return (
      <div>
        <div style={{width: '200px', height: '100px', backgroundColor: '#cccccc', textAlign: 'center'}}
          onDragEnter={e => { e.stopPropagation(); e.preventDefault(); }}
          onDragOver={e => { e.stopPropagation(); e.preventDefault(); }}
          onDrop={this.handleDrop}>
          Drop stuff here~
        </div>
        <button type="button" onClick={onSubmit}>Upload</button>
      </div>
    );
  }

}
