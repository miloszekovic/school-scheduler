import React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { R } from '../../lib/routes';
import { PageContainer } from './PageContainer';
import { Breadcrumbs } from '../widgets/Breadcrumbs';

export function NotFoundPage() {
  return (
    <PageContainer>
      <Breadcrumbs />

      <Jumbotron>
        <h2 className="text-danger">Page not found</h2>

        <LinkContainer to={R.home}>
          <Button>Go back home</Button>
        </LinkContainer>
      </Jumbotron>
    </PageContainer>
  );
}
