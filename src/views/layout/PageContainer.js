import React from 'react';
import { Container } from 'react-bootstrap';

export function PageContainer({ className, children }) {
  return <Container fluid className={'mt-4 ' + (className || '')}>{children}</Container>;
}
