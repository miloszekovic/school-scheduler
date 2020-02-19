import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import { PageContainer } from '../layout/PageContainer';
import { deleteLecture, fetchLectures, fetchRoomLookup, fetchTeacherLookup } from '../../lib/api';
import { ErrorAlert } from '../widgets/ErrorAlert';
import { Spinner } from '../widgets/Spinner';
import { BREADCRUMBS, makeLink, R } from '../../lib/routes';
import { Breadcrumbs } from '../widgets/Breadcrumbs';
import { ConfirmModal } from '../widgets/ConfirmModal';
import { SpacingGroup } from '../widgets/SpacingGroup';
import { DataTable, DataTableColumn } from '../widgets/DataTable';
import { DAYS_OF_WEEK_LABELS } from '../../lib/types';
import { hmToString } from '../../lib/tools';
import { IconButton } from '../widgets/IconButton';

import { LecturesNewButton } from './LecturesNewButton';

import './LecturesPage.css';

export class LecturesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /** @type Lecture[] */
      lectures: null,
      /** @type {Object.<string, Teacher>} */
      teacherLookup: {},
      /** @type {Object.<string, Room>} */
      roomLookup: {},
      deletingId: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({ lectures: null });
    return Promise.all([fetchTeacherLookup(), fetchRoomLookup(), fetchLectures()]).then(
      ([teacherLookup, roomLookup, lectures]) => {
        this.setState({ lectures, teacherLookup, roomLookup });
      },
      error => {
        this.setState({ error, lectures: [] });
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
      .then(() => deleteLecture(this.state.deletingId))
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
      new DataTableColumn('title', 'Title'),
      new DataTableColumn(
        'roomId',
        'Room',
        /** Lecture */ lecture => (
          <strong>{this.state.roomLookup[lecture.roomId].designation}</strong>
        )
      ),
      new DataTableColumn(
        'teacherIds',
        'Teachers',
        /** Lecture */ lecture => (
          <ul>
            {lecture.teacherIds.map(teacherId => (
              <li key={teacherId}>{this.state.teacherLookup[teacherId].fullName}</li>
            ))}
          </ul>
        )
      ),
      new DataTableColumn(
        'day',
        'Day of week',
        /** Lecture */ lecture => DAYS_OF_WEEK_LABELS[lecture.dayOfWeek]
      ),
      new DataTableColumn(
        'from',
        'From',
        /** Lecture */ lecture => hmToString(lecture.startHour, lecture.startMinute)
      ),
      new DataTableColumn(
        'to',
        'To',
        /** Lecture */ lecture => hmToString(lecture.endHour, lecture.endMinute)
      ),
      new DataTableColumn('', '', lecture => {
        return (
          <SpacingGroup>
            <LinkContainer to={makeLink(R.lectureEdit, lecture.id)}>
              <IconButton
                size="sm"
                disabled={this.state.deletingId === lecture.id}
                icon={IconButton.icons.edit}
              >
                Edit
              </IconButton>
            </LinkContainer>
            <IconButton
              icon={IconButton.icons.close_circled}
              size="sm"
              variant="danger"
              disabled={this.state.deletingId === lecture.id}
              onClick={() => {
                this.setState({ deletingId: lecture.id });
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
            <p>There doesn't seem to be any lectures here</p>
            <p>
              <LinkContainer to={R.lectureNew}>
                <IconButton variant="primary" size="lg" icon={IconButton.icons.plus}>
                  Create some
                </IconButton>
              </LinkContainer>
            </p>
          </h4>
        }
        data={this.state.lectures}
      />
    );
  }

  render() {
    return (
      <PageContainer className="LecturesPage">
        <Breadcrumbs breadcrumbs={[BREADCRUMBS.lectures]} />

        {this.renderError()}

        <LecturesNewButton />

        {this.state.lectures ? this.renderTable() : <Spinner role={Spinner.roles.page} />}

        <LecturesNewButton />

        <ConfirmModal
          callback={this.confirmDeleteCallback}
          confirmLabel="Yes, delete"
          show={!!this.state.deletingId}
        >
          <p>Are you sure you wish to delete lecture {this.state.deletingId}?</p>
        </ConfirmModal>
      </PageContainer>
    );
  }
}
