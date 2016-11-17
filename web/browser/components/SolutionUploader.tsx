/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016 Jacob Peddicord <jacob@peddicord.net>
 */

import * as React from 'react';
import * as alertify from 'alertify.js';

interface Props {
  onSubmit: Function;
}
interface State {
  ready: boolean;
  selected: string;
}
// Some items below should have type casts removed once React bindings have mapped types:
// https://github.com/Microsoft/TypeScript/pull/12114

export default class SolutionUploader extends React.Component<Props, State> {
  pickerRef: HTMLElement;

  fileContent = null;
  state = {
    ready: false,
    selected: null,
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
      alertify.error('This form only accepts one file.');
      return;
    }

    const name = files[0].name;
    const reader = new FileReader();

    reader.addEventListener('load', e => {
      const content = (e.target as FileReader).result;
      this.fileContent = content;
      this.setState({ready: true, selected: name} as State);
    });

    reader.addEventListener('error', e => {
      const err = (e.target as FileReader).error.name;
      alertify.error(`Couldn't read file: ${err}`);
      this.fileContent = null;
      this.setState({ready: false} as State);
    });

    reader.readAsText(files[0]);
  }

  handleSubmit = e => {
    const { onSubmit } = this.props;
    if (this.state.ready) {
      onSubmit(this.fileContent);
    }
    this.setState({ready: false, selected: null});
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
