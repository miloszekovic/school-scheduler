import React from 'react';
import { Router } from 'react-router';

import { App } from './App';

export function Root({ history }) {
  return (
    <Router history={history}>
      <App />
    </Router>
  );
}
