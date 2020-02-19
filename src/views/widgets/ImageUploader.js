import React, { Component, createRef } from 'react';
import { Button, Badge } from 'react-bootstrap';
import ReactDropzone from 'react-dropzone';
import * as PropTypes from 'prop-types';

import { ErrorAlert } from './ErrorAlert';
import { Spinner } from './Spinner';
import { Icon } from './Icon';
import { classes } from '../../lib/tools';

import './ImageUploader.css';

const canAcceptFiles = state => {
  return !state.isUploading && !state.error;
};

export class ImageUploader extends Component {
  static propTypes = {
    acceptedFileTypes: PropTypes.array,
    multiple: PropTypes.bool,
    hint: PropTypes.string,
    uploadLabel: PropTypes.string,
    handleUpload: PropTypes.func,
    onFiles: PropTypes.func,
  };

  static defaultProps = {
    acceptedFileTypes: ['image/png', 'image/jpeg'],
    multiple: false,
    hint: 'You can drag images into this box!',
    uploadLabel: 'Upload',
  };

  constructor(props) {
    super(props);

    this.state = {
      isUploading: false,
      error: null,
    };

    this.dropzoneRef = createRef();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDropFiles = acceptedFiles => {
    if (!acceptedFiles || !acceptedFiles.length) {
      return;
    }

    if (this.state.isUploading) {
      return;
    }

    if (!this.props.handleUpload) {
      return;
    }

    this.setState({
      isUploading: true,
    });

    if (this.props.onFiles) {
      this.props.onFiles(acceptedFiles);
    }

    return Promise.resolve()
      .then(() => this.props.handleUpload(acceptedFiles))
      .then(
        () => {
          if (!this._isMounted) {
            return;
          }

          this.setState({
            isUploading: false,
          });
        },
        error => {
          if (!this._isMounted) {
            return;
          }

          this.setState({
            error,
            isUploading: false,
          });
        }
      );
  };

  renderErrorOverlay() {
    if (!this.state.error) {
      return null;
    }

    return (
      <div className="ImageUploader-error-overlay">
        <ErrorAlert
          error={this.state.error}
          message={'Image upload failed'}
          onDismiss={() => this.setState({ error: null })}
        />
      </div>
    );
  }

  renderUploadingOverlay() {
    if (!this.state.isUploading) {
      return null;
    }

    return (
      <div className="ImageUploader-spinner-overlay">
        <Spinner role={Spinner.roles.block} />
      </div>
    );
  }

  renderContent = (rootProps = {}, inputProps = {}, isDragActive) => {
    let hint = null;
    if (this.props.hint) {
      hint = (
        <span className="ImageUploader-bar-hint">
          <Badge variant="info">Hint</Badge>
          {' ' + this.props.hint}
        </span>
      );
    }

    let uploadButton = null;
    if (this.props.handleUpload) {
      uploadButton = (
        <Button
          className="ImageUploader-bar-button"
          variant="primary"
          size="sm"
          disabled={!canAcceptFiles(this.state)}
          onClick={() => {
            this.dropzoneRef.current && this.dropzoneRef.current.open();
          }}
        >
          <Icon icon={Icon.upload} />
          <span>{this.props.uploadLabel}</span>
        </Button>
      );
    }

    return (
      <div
        {...rootProps}
        className={classes(
          `ImageUploader-dropzone`,
          isDragActive && 'ImageUploader-dropzone-active'
        )}
      >
        <div className="ImageUploader-bar">
          {hint}
          {uploadButton}
        </div>
        <div className="ImageUploader-content">{this.props.children}</div>

        <div className="ImageUploader-drop-overlay">
          <Icon icon={Icon.arrow_down} />
        </div>

        {this.renderUploadingOverlay()}

        {this.renderErrorOverlay()}

        <input {...inputProps} />
      </div>
    );
  };

  render() {
    const enableDropzone = canAcceptFiles(this.state);

    if (!enableDropzone) {
      return <div className="ImageUploader">{this.renderContent()}</div>;
    }

    const accept = this.props.acceptedFileTypes.join(', ');
    return (
      <div className="ImageUploader">
        <ReactDropzone ref={this.dropzoneRef} onDrop={this.onDropFiles} accept={accept} noClick>
          {({ getRootProps, getInputProps, isDragActive }) =>
            this.renderContent(getRootProps(), getInputProps(), isDragActive)
          }
        </ReactDropzone>
      </div>
    );
  }
}
