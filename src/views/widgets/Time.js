import React from 'react';
import * as PropTypes from 'prop-types';
import { classes, shortDate } from '../../lib/tools';

export function Time({ value, className }) {
  if (!value) {
    return null;
  }

  if (typeof value !== 'object') {
    value = new Date(value);
  }

  return (
    <time className={classes('Time', className)} dateTime={value} title={value.toISOString()}>
      {shortDate(value)}
    </time>
  );
}

Time.propTypes = {
  value: PropTypes.any.isRequired,
};
