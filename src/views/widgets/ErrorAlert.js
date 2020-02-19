import React from 'react';
import { Alert, Badge } from 'react-bootstrap';

export function ErrorAlert({ error, message, onDismiss }) {
  if (!message) {
    message = error ? error.message || String(error) : 'Error';
  } else if (error) {
    message = message + ': ' + (error.message || String(error));
  }

  const statusBadge =
    (error && error.status && (
      <Badge variant={'danger'} className="mr-2 align-middle">
        {error.status}
      </Badge>
    )) ||
    null;

  return (
    <Alert variant="danger" dismissible={!!onDismiss} onClose={onDismiss}>
      {statusBadge}
      {message}
    </Alert>
  );
}
