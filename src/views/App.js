import React from 'react';
import { MainNavbar } from './layout/MainNavbar';
import { Route, Switch } from 'react-router';

import { R } from '../lib/routes';
import { HomePage } from './layout/HomePage';
import { NotFoundPage } from './layout/NotFoundPage';
import { TeachersPage } from './teachers/TeachersPage';
import { TeacherEditPage } from './teachers/TeacherEditPage';
import { RoomsPage } from './rooms/RoomsPage';
import { RoomEditPage } from './rooms/RoomEditPage';
import { LecturesPage } from './lectures/LecturesPage';
import { LectureEditPage } from './lectures/LectureEditPage';

import './App.css';

export function App() {
  return (
    <div className="App">
      <MainNavbar />
      <Switch>
        <Route path={R.home} component={HomePage} exact />

        <Route path={R.teachers} component={TeachersPage} exact />
        <Route
          path={R.teacherNew}
          exact
          render={(...props) => <TeacherEditPage isNew={true} {...props} />}
        />
        <Route
          path={R.teacherEdit}
          exact
          render={(...props) => <TeacherEditPage isNew={false} {...props} />}
        />

        <Route path={R.rooms} component={RoomsPage} exact />
        <Route
          path={R.roomNew}
          exact
          render={(...props) => <RoomEditPage isNew={true} {...props} />}
        />
        <Route
          path={R.roomEdit}
          exact
          render={(...props) => <RoomEditPage isNew={false} {...props} />}
        />

        <Route path={R.lectures} component={LecturesPage} exact />
        <Route
          path={R.lectureNew}
          exact
          render={(...props) => <LectureEditPage isNew={true} {...props} />}
        />
        <Route
          path={R.lectureEdit}
          exact
          render={(...props) => <LectureEditPage isNew={false} {...props} />}
        />

        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
