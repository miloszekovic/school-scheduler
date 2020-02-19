import React from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { PageContainer } from '../layout/PageContainer';
import { deleteTeacher, fetchTeachers } from '../../lib/api';
import { ErrorAlert } from '../widgets/ErrorAlert';
import { Spinner } from '../widgets/Spinner';
import { BREADCRUMBS, makeLink, R } from '../../lib/routes';
import { Breadcrumbs } from '../widgets/Breadcrumbs';
import { Base64Image } from '../widgets/Base64Image';
import { ConfirmModal } from '../widgets/ConfirmModal';
import { SpacingGroup } from '../widgets/SpacingGroup';
import { DataTable, DataTableColumn } from '../widgets/DataTable';
import { IconButton } from '../widgets/IconButton';

import './TeachersPage.css';

export class TeachersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /** @type Teacher[] */
      teachers: null,
      deletingId: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({ teachers: null });
    fetchTeachers().then(
      teachers => {
        this.setState({ teachers });
      },
      error => {
        this.setState({ error, teachers: [] });
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
      .then(() => deleteTeacher(this.state.deletingId))
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
      new DataTableColumn('avatar', 'Avatar', teacher => (
        <Base64Image src={teacher.avatar} className="TeachersPage-avatar" alt="Avatar" />
      )),
      new DataTableColumn('fullName', 'Full name'),
      new DataTableColumn('email', 'Email', teacher => (
        <a href={`mailto:${teacher.email}`} target="_blank" rel="noopener noreferrer">
          {teacher.email}
        </a>
      )),
      new DataTableColumn('createdAt', 'Created'),
      new DataTableColumn('updatedAt', 'Updated'),
      new DataTableColumn('', '', teacher => {
        return (
          <SpacingGroup>
            <LinkContainer to={makeLink(R.teacherEdit, teacher.id)}>
              <IconButton
                size="sm"
                disabled={this.state.deletingId === teacher.id}
                icon={IconButton.icons.edit}
              >
                Edit
              </IconButton>
            </LinkContainer>
            <IconButton
              icon={IconButton.icons.close_circled}
              size="sm"
              variant="danger"
              disabled={this.state.deletingId === teacher.id}
              onClick={() => {
                this.setState({ deletingId: teacher.id });
              }}
            >
              Delete
            </IconButton>
          </SpacingGroup>
        );
      }),
    ];

    return (
      <DataTable
        columns={columns}
        noDataPlaceholder={
          <h4 className="text-center my-5">
            <p>There doesn't seem to be any teachers here</p>
            <p>
              <LinkContainer to={R.teacherNew}>
                <IconButton variant="primary" size="lg" icon={IconButton.icons.plus}>
                  Create some
                </IconButton>
              </LinkContainer>
            </p>
          </h4>
        }
        data={this.state.teachers}
      />
    );
  }

  render() {
    return (
      <PageContainer className="TeachersPage">
        <Breadcrumbs breadcrumbs={[BREADCRUMBS.teachers]} />

        {this.renderError()}

        {this.state.teachers ? this.renderTable() : <Spinner role={Spinner.roles.page} />}

        <div className="ButtonContainer">
          <ButtonToolbar aria-label="Main toolbar" className="mb-2">
            <LinkContainer to={R.teacherNew}>
              <IconButton variant="primary" size="lg" icon={IconButton.icons.plus}>
                Create new teacher
              </IconButton>
            </LinkContainer>
          </ButtonToolbar>
        </div>

        <ConfirmModal
          callback={this.confirmDeleteCallback}
          confirmLabel="Yes, delete"
          show={!!this.state.deletingId}
        >
          <p>Are you sure you wish to delete teacher {this.state.deletingId}?</p>
        </ConfirmModal>
      </PageContainer>
    );
  }
}
