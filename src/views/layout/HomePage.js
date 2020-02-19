import React from 'react';
import { Col, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { PageContainer } from './PageContainer';
import { Breadcrumbs } from '../widgets/Breadcrumbs';
import { R } from '../../lib/routes';
import {
  LECTURE_DURATION_LIMITS,
  MAX_TEACHERS_PER_LESSON,
  MINUTE_INCREMENTS,
  WORKING_HOURS,
} from '../../lib/types';
import { minutesToString } from '../../lib/tools';

export function HomePage() {
  return (
    <PageContainer>
      <Breadcrumbs />
      <Jumbotron className="bg-danger text-white">
        <h1>School scheduler</h1>
        <h4>Organizational tool for the next generation of educators!</h4>
      </Jumbotron>
      <Col>
        <h5>About scheduler</h5>
        <div>
          <p>
            The purpose of this app is to help you get organized with your weekly lecture
            schedule. At the top of the screen, you will find 3 sections:
          </p>
          <ul>
            <li>
              <Link to={R.teachers}>Teachers</Link>
              <br />
              Create, edit and remove teachers from staff
            </li>
            <li>
              <Link to={R.rooms}>Rooms</Link>
              <br />
              Create, edit and remove rooms in the building
            </li>
            <li>
              <Link to={R.lectures}>Lectures</Link>
              <br />
              Here is where the magic happens! Create lectures, assign rooms and teachers to them
              and schedule them for a weekly time slot, all in one convenient place. Our
              proprietary <em>SchoolmasterAI PRO™</em> will ensure there are no conflicts with
              existing assignments.
            </li>
          </ul>
        </div>
        <div>
          <h5>Scheduling rules</h5>
        </div>
        <div>
          <p>
            Your administrators have kindly provided us with some scheduling guidelines. They are
            listed here for informational purposes only. <em>SchoolmasterAI PRO™</em> will ensure
            there are no incorrect inputs with convenient error messages.
          </p>
          <ul>
            <li>
              School's working hours are between {minutesToString(WORKING_HOURS.startMinutes)} and{' '}
              {minutesToString(WORKING_HOURS.endMinutes)}, every day.
            </li>
            <li>
              Each lecture must have between 1 and {MAX_TEACHERS_PER_LESSON} teachers assigned.
            </li>
            <li>
              When setting a time, we can only accept minutes in increments of {MINUTE_INCREMENTS}
              . So,{' '}
              {(() => {
                const values = [];
                for (let minute = 0; minute < 60; minute += MINUTE_INCREMENTS) {
                  values.push('"' + minute + '"');
                }
                return values.slice(0, -1).join(', ') + ' and ' + values[values.length - 1];
              })()}{' '}
              are valid values for the minute.
            </li>
            <li>
              All lectures must be between {LECTURE_DURATION_LIMITS.minMinutes} and{' '}
              {LECTURE_DURATION_LIMITS.maxMinutes} minutes long.
            </li>
          </ul>
          <p>Thank you for your attention and happy scheduling!</p>
        </div>
      </Col>
    </PageContainer>
  );
}
