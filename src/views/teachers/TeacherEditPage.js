import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import * as PropTypes from 'prop-types';

import { PageContainer } from '../layout/PageContainer';
import { ErrorAlert } from '../widgets/ErrorAlert';
import { Spinner } from '../widgets/Spinner';
import { fetchTeacher, updateTeacher, createTeacher } from '../../lib/api';
import { BREADCRUMBS, R } from '../../lib/routes';
import { Breadcrumbs } from '../widgets/Breadcrumbs';
import { ImageUploader } from '../widgets/ImageUploader';
import { fileToBase64 } from '../../lib/tools';

import './TeacherEditPage.css';
import { Base64Image } from '../widgets/Base64Image';
import { IconButton } from '../widgets/IconButton';

class TeacherEditPageComponent extends React.Component {
  static propTypes = {
    isNew: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      /** @type Teacher */
      teacher: null,
      error: null,
      submitting: false,
    };
  }

  get teacherId() {
    return this.props.isNew ? null : this.props.match.params.id;
  }

  componentDidMount() {
    this.loadTeacher();
  }

  loadTeacher() {
    if (!this.teacherId) {
      return this.setState({ teacher: {} });
    }

    this.setState({ teacher: null });
    fetchTeacher(this.teacherId).then(
      teacher => {
        this.setState({ teacher });
      },
      error => {
        this.setState({ error, teacher: {} });
      }
    );
  }

  renderError() {
    if (this.state.error) {
      return <ErrorAlert error={this.state.error} />;
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitting: true });
    return Promise.resolve()
      .then(() => {
        return this.teacherId
          ? updateTeacher(this.teacherId, this.state.teacher)
          : createTeacher(this.state.teacher);
      })
      .then(
        () => {
          this.props.history.push(R.teachers);
        },
        error => {
          this.setState({ error, submitting: false });
        }
      );
  };

  updateTeacher = (field, value) => {
    this.setState({
      teacher: {
        ...this.state.teacher,
        [field]: value,
      },
    });
  };

  teacherUpdater = field => e => this.updateTeacher(field, e.target.value);

  renderForm() {
    if (!this.state.teacher) {
      return;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                value={this.state.teacher.fullName || ''}
                onChange={this.teacherUpdater('fullName')}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={this.state.teacher.email || ''}
                onChange={this.teacherUpdater('email')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Avatar</Form.Label>
              <ImageUploader
                handleUpload={files => {
                  return fileToBase64(files[0]).then(base64Image => {
                    this.updateTeacher('avatar', base64Image);
                  });
                }}
              >
                <Base64Image
                  className="TeacherEditPage-avatar"
                  src={this.state.teacher && this.state.teacher.avatar}
                  alt="Avatar view"
                />
              </ImageUploader>
            </Form.Group>
          </Col>
        </Row>

        <div className="ButtonContainer">
          <IconButton
            icon={IconButton.icons.save}
            variant="success"
            type="submit"
            className="mr-2"
            disabled={this.state.submitting}
          >
            {this.teacherId ? 'Save changes' : 'Create'}
          </IconButton>
          <LinkContainer to={R.teachers}>
            <IconButton
              icon={IconButton.icons.exit}
              variant="light"
              type="button"
              disabled={this.state.submitting}
            >
              Cancel
            </IconButton>
          </LinkContainer>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <PageContainer className="TeacherEditPage">
        <Breadcrumbs
          breadcrumbs={[
            BREADCRUMBS.teachers,
            this.teacherId ? BREADCRUMBS.teacherEdit : BREADCRUMBS.teacherNew,
          ]}
        />
        <h2 className="pt-2 pb-4">
          {this.teacherId ? `Edit teacher ${this.teacherId}` : 'Create new teacher'}
        </h2>
        {this.renderError()}
        {this.state.teacher ? this.renderForm() : <Spinner role={Spinner.roles.page} />}
      </PageContainer>
    );
  }
}

export const TeacherEditPage = withRouter(TeacherEditPageComponent);
