import React from 'react';

import { classes } from '../../lib/tools';

import './SpacingGroup.css';

export function SpacingGroup({ className, children }) {
  return <div className={classes('SpacingGroup', className)}>{children}</div>;
}
