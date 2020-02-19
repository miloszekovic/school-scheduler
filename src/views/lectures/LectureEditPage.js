import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import * as PropTypes from 'prop-types';

import { PageContainer } from '../layout/PageContainer';
import { ErrorAlert } from '../widgets/ErrorAlert';
import { Spinner } from '../widgets/Spinner';

import {
  fetchLecture,
  updateLecture,
  createLecture,
  fetchTeacherLookup,
  fetchRoomLookup,
} from '../../lib/api';
import { BREADCRUMBS, R } from '../../lib/routes';
import { Breadcrumbs } from '../widgets/Breadcrumbs';
import { IconButton } from '../widgets/IconButton';
import { Select } from '../widgets/Select';
import { DAYS_OF_WEEK, DAYS_OF_WEEK_LABELS } from '../../lib/types';

import './LectureEditPage.css';

const DAYS_OF_WEEK_OPTIONS = Object.keys(DAYS_OF_WEEK).reduce((options, value) => {
  options[value] = { value, label: DAYS_OF_WEEK_LABELS[value] };
  return options;
}, {});

class LectureEditPageComponent extends React.Component {
  static propTypes = {
    isNew: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      /** @type Lecture */
      lecture: null,

      /** @type {Object.<string, Teacher>} */
      teacherLookup: {},

      /** @type {Object.<string, Room>} */
      roomLookup: {},

      error: null,
      submitting: false,
    };
  }

  get lectureId() {
    return this.props.isNew ? null : this.props.match.params.id;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ lecture: null });

    Promise.all([
      this.lectureId ? fetchLecture(this.lectureId) : Promise.resolve({}),
      fetchTeacherLookup(),
      fetchRoomLookup(),
    ]).then(
      ([lecture, teacherLookup, roomLookup]) => {
        this.setState({
          lecture,
          teacherLookup,
          roomLookup,
        });
      },
      error => {
        this.setState({ error, lecture: {} });
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
        return this.lectureId
          ? updateLecture(this.lectureId, this.state.lecture)
          : createLecture(this.state.lecture);
      })
      .then(
        () => {
          this.props.history.push(R.lectures);
        },
        error => {
          this.setState({ error, submitting: false });
        }
      );
  };

  updateLecture = (field, value) => {
    this.setState({
      lecture: {
        ...this.state.lecture,
        [field]: value,
      },
    });
  };

  lectureUpdater = field => e => this.updateLecture(field, e.target.value);

  renderForm() {
    /** @type {Lecture} */
    const lecture = this.state.lecture;
    if (!lecture) {
      return;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col sm={8}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={lecture.title || ''}
                onChange={this.lectureUpdater('title')}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formRoom">
                  <Form.Label>Room</Form.Label>
                  <Select
                    options={Object.values(this.state.roomLookup)}
                    onChange={room => {
                      this.updateLecture('roomId', room ? room.id : null);
                    }}
                    value={this.state.roomLookup[lecture.roomId] || null}
                    placeholder="Select a room"
                    inputId="formRoom"
                    getOptionLabel={room => <span className="text-monospace">{room.designation}</span>}
                    isOptionSelected={() => {
                      // No idea why this is needed
                      return false;
                    }}
                    isClearable={true}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTeachers">
                  <Form.Label>Teachers</Form.Label>
                  <Select
                    isMulti
                    getOptionValue={teacher => teacher.id}
                    options={Object.values(this.state.teacherLookup)}
                    onChange={teachers => {
                      this.updateLecture(
                        'teacherIds',
                        teachers ? teachers.map(teacher => teacher.id) : []
                      );
                    }}
                    value={
                      lecture.teacherIds
                        ? lecture.teacherIds.map(teacherId => this.state.teacherLookup[teacherId])
                        : null
                    }
                    placeholder="Select teachers"
                    inputId="formTeachers"
                    getOptionLabel={teacher => teacher.fullName}
                    isClearable={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group controlId="formDayOfWeek">
                  <Form.Label>Day of the week</Form.Label>
                  <Select
                    options={Object.values(DAYS_OF_WEEK_OPTIONS)}
                    onChange={option => {
                      this.updateLecture('dayOfWeek', option ? option.value : null);
                    }}
                    value={DAYS_OF_WEEK_OPTIONS[lecture.dayOfWeek] || null}
                    placeholder="Select day of the week"
                    inputId="formDayOfWeek"
                    isClearable={true}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Row>
                  <Col>
                    <Form.Group controlId="formStartHour">
                      <Form.Label>Start hour</Form.Label>
                      <Form.Control
                        type="number"
                        value={String(lecture.startHour) || ''}
                        onChange={this.lectureUpdater('startHour')}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formStartMinute">
                      <Form.Label>Start minute</Form.Label>
                      <Form.Control
                        type="number"
                        value={String(lecture.startMinute) || ''}
                        onChange={this.lectureUpdater('startMinute')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={4}>
                <Row>
                  <Col>
                    <Form.Group controlId="formEndHour">
                      <Form.Label>End hour</Form.Label>
                      <Form.Control
                        type="number"
                        value={String(lecture.endHour) || ''}
                        onChange={this.lectureUpdater('endHour')}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="formEndMinute">
                      <Form.Label>End minute</Form.Label>
                      <Form.Control
                        type="number"
                        value={String(lecture.endMinute) || ''}
                        onChange={this.lectureUpdater('endMinute')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
                {this.lectureId ? 'Save changes' : 'Create'}
              </IconButton>
              <LinkContainer to={R.lectures}>
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
          </Col>
          <Col sm={4}>
            <div className="AvailableTimeTable">
              <table className="DataTable table">
                <tr>
                  <th>Available time in room <u>EC1</u> on <u>Monday</u>:</th>
                </tr>
                <tr>
                  <td>from 8am to 10am</td>
                </tr>
                <tr>
                  <td>from 11am to 12.30pm</td>
                </tr>
                <tr>
                  <td>from 1pm to 3.15pm</td>
                </tr>
                <tr>
                  <td>from 5pm to 7pm</td>
                </tr>
              </table>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <PageContainer className="LectureEditPage">
        <Breadcrumbs
          breadcrumbs={[
            BREADCRUMBS.lectures,
            this.lectureId ? BREADCRUMBS.lectureEdit : BREADCRUMBS.lectureNew,
          ]}
        />
        <h2 className="pt-2 pb-4">
          {this.lectureId ? `Edit lecture ${this.lectureId}` : 'Create new lecture'}
        </h2>
        {this.renderError()}
        {this.state.lecture ? this.renderForm() : <Spinner role={Spinner.roles.page} />}
      </PageContainer>
    );
  }
}

export const LectureEditPage = withRouter(LectureEditPageComponent);
