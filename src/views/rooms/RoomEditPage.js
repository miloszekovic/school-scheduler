import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import * as PropTypes from 'prop-types';

import { PageContainer } from '../layout/PageContainer';
import { ErrorAlert } from '../widgets/ErrorAlert';
import { Spinner } from '../widgets/Spinner';
import { fetchRoom, updateRoom, createRoom } from '../../lib/api';
import { BREADCRUMBS, R } from '../../lib/routes';
import { Breadcrumbs } from '../widgets/Breadcrumbs';
import { IconButton } from '../widgets/IconButton';

import './RoomEditPage.css';

class RoomEditPageComponent extends React.Component {
  static propTypes = {
    isNew: PropTypes.bool,
    match: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      /** @type Room */
      room: null,
      error: null,
      submitting: false,
    };
  }

  get roomId() {
    return this.props.isNew ? null : this.props.match.params.id;
  }

  componentDidMount() {
    this.loadRoom();
  }

  loadRoom() {
    if (!this.roomId) {
      return this.setState({ room: {} });
    }

    this.setState({ room: null });
    fetchRoom(this.roomId).then(
      room => {
        this.setState({ room });
      },
      error => {
        this.setState({ error, room: {} });
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
        return this.roomId ? updateRoom(this.roomId, this.state.room) : createRoom(this.state.room);
      })
      .then(
        () => {
          this.props.history.push(R.rooms);
        },
        error => {
          this.setState({ error, submitting: false });
        }
      );
  };

  updateRoom = (field, value) => {
    this.setState({
      room: {
        ...this.state.room,
        [field]: value,
      },
    });
  };

  roomUpdater = field => e => this.updateRoom(field, e.target.value);

  renderForm() {
    if (!this.state.room) {
      return;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formDesignation">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                value={this.state.room.designation || ''}
                onChange={this.roomUpdater('designation')}
              />
              <Form.Text className="text-muted">
                Between 1 and 5 characters, all uppercase.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={this.state.room.description || ''}
                onChange={this.roomUpdater('description')}
              />
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
            {this.roomId ? 'Save changes' : 'Create'}
          </IconButton>
          <LinkContainer to={R.rooms}>
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
      <PageContainer className="RoomEditPage">
        <Breadcrumbs
          breadcrumbs={[
            BREADCRUMBS.rooms,
            this.roomId ? BREADCRUMBS.roomEdit : BREADCRUMBS.roomNew,
          ]}
        />
        <h2 className="pt-2 pb-4">
          {this.roomId ? `Edit room with ID: ${this.roomId}` : 'Create new room'}
        </h2>
        {this.renderError()}
        {this.state.room ? this.renderForm() : <Spinner role={Spinner.roles.page} />}
      </PageContainer>
    );
  }
}

export const RoomEditPage = withRouter(RoomEditPageComponent);
