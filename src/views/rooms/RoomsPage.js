import React from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { PageContainer } from '../layout/PageContainer';
import { deleteRoom, fetchRooms } from '../../lib/api';
import { ErrorAlert } from '../widgets/ErrorAlert';
import { Spinner } from '../widgets/Spinner';
import { BREADCRUMBS, makeLink, R } from '../../lib/routes';
import { Breadcrumbs } from '../widgets/Breadcrumbs';
import { ConfirmModal } from '../widgets/ConfirmModal';
import { SpacingGroup } from '../widgets/SpacingGroup';
import { DataTable, DataTableColumn } from '../widgets/DataTable';
import { IconButton } from '../widgets/IconButton';

import './RoomsPage.css';

export class RoomsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /** @type Room[] */
      rooms: null,
      deletingId: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({ rooms: null });
    fetchRooms().then(
      rooms => {
        this.setState({ rooms });
      },
      error => {
        this.setState({ error, rooms: [] });
      }
    );
  };

  confirmDeleteCallback = confirmed => {
    if (!this.state.deletingId) {
      return;
    }

    if (!confirmed) {
      return this.setState({ deletingId: null });
    }

    Promise.resolve()
      .then(() => deleteRoom(this.state.deletingId))
      .then(
        () => {
          this.setState({ deletingId: null });
          this.loadData();
        },
        error => {
          this.setState({ deletingId: null, error });
        }
      );
  };

  renderError() {
    if (this.state.error) {
      return <ErrorAlert error={this.state.error} />;
    }
  }

  renderTable() {
    const columns = [
      new DataTableColumn('id', 'ID'),
      new DataTableColumn('designation', 'Designation', room => (
        <strong className="text-monospace">{room.designation}</strong>
      )),
      new DataTableColumn('description', 'Description'),
      new DataTableColumn('createdAt', 'Created'),
      new DataTableColumn('updatedAt', 'Updated'),
      new DataTableColumn(
        '',
        '',
        /** Room */ room => {
          return (
            <SpacingGroup>
              <LinkContainer to={makeLink(R.roomEdit, room.id)}>
                <IconButton
                  size="sm"
                  disabled={this.state.deletingId === room.id}
                  icon={IconButton.icons.edit}
                >
                  Edit
                </IconButton>
              </LinkContainer>
              <IconButton
                icon={IconButton.icons.close_circled}
                size="sm"
                variant="danger"
                disabled={this.state.deletingId === room.id}
                onClick={() => {
                  this.setState({ deletingId: room.id });
                }}
              >
                Delete
              </IconButton>
            </SpacingGroup>
          );
        }
      ),
    ];

    return (
      <DataTable
        columns={columns}
        noDataPlaceholder={
          <h4 className="text-center my-5">
            <p>There doesn't seem to be any rooms here</p>
            <p>
              <LinkContainer to={R.roomNew}>
                <IconButton variant="primary" size="lg" icon={IconButton.icons.plus}>
                  Create some
                </IconButton>
              </LinkContainer>
            </p>
          </h4>
        }
        data={this.state.rooms}
      />
    );
  }

  render() {
    return (
      <PageContainer className="RoomsPage">
        <Breadcrumbs breadcrumbs={[BREADCRUMBS.rooms]} />

        {this.renderError()}

        {this.state.rooms ? this.renderTable() : <Spinner role={Spinner.roles.page} />}

        <div className="ButtonContainer">
          <ButtonToolbar aria-label="Main toolbar" className="mb-2">
            <LinkContainer to={R.roomNew}>
              <IconButton variant="primary" size="lg" icon={IconButton.icons.plus}>
                Create new room
              </IconButton>
            </LinkContainer>
          </ButtonToolbar>
        </div>

        <ConfirmModal
          callback={this.confirmDeleteCallback}
          confirmLabel="Yes, delete"
          show={!!this.state.deletingId}
        >
          <p>Are you sure you wish to delete room {this.state.deletingId}?</p>
        </ConfirmModal>
      </PageContainer>
    );
  }
}
