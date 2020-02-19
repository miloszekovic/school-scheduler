import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

import { BREADCRUMBS } from '../../lib/routes';
import { LinkContainer } from 'react-router-bootstrap';

export function Breadcrumbs({ breadcrumbs }) {
  breadcrumbs = [BREADCRUMBS.home].concat(breadcrumbs || []);

  const breadcrumbItems = breadcrumbs.map((/** Breadcrumb */ breadcrumb, index) => (
    <LinkContainer key={breadcrumb.route} to={breadcrumb.route}>
      <Breadcrumb.Item active={index >= breadcrumbs.length - 1}>{breadcrumb.title}</Breadcrumb.Item>
    </LinkContainer>
  ));

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
}
