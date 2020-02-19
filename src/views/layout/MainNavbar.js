import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router';

import { R } from '../../lib/routes';

export function MainNavbarComponent({ location }) {
  return (
    <Navbar bg="info" variant="dark" expand="lg">
      <Container fluid>
        <LinkContainer to={R.home}>
          <Navbar.Brand>School scheduler</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/* NOTE: We are setting active:false due to this:
                      https://github.com/react-bootstrap/react-router-bootstrap/issues/242 */}
            <LinkContainer to={R.home} exact>
              <Nav.Link active={false}>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to={R.teachers}>
              <Nav.Link active={false}>Teachers</Nav.Link>
            </LinkContainer>
            <LinkContainer to={R.rooms}>
              <Nav.Link active={false}>Rooms</Nav.Link>
            </LinkContainer>
            <LinkContainer to={R.lectures}>
              <Nav.Link active={false}>Lectures</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export const MainNavbar = withRouter(MainNavbarComponent);
