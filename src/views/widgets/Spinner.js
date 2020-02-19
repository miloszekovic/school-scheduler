import React from 'react';
import { Spinner as BSpinner } from 'react-bootstrap';

import { classes } from '../../lib/tools';

import './Spinner.css';

export function Spinner({ role = Spinner.roles.inline, message = 'Loading...' }) {
  return (
    <div className={classes('Spinner', `Spinner-${role}`)}>
      <BSpinner animation="border" role="status">
        <span className="sr-only">{message}</span>
      </BSpinner>
    </div>
  );
}

Spinner.roles = {
  page: 'page',
  block: 'block',
  inline: 'inline',
};
