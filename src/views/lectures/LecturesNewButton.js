import React from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { R } from '../../lib/routes';
import { IconButton } from '../widgets/IconButton';

export class LecturesNewButton extends React.Component {
  render() {
    return (
        <div className="ButtonContainer">
            <ButtonToolbar aria-label="Main toolbar" className="mb-2">
            <LinkContainer to={R.lectureNew}>
                <IconButton variant="primary" size="lg" icon={IconButton.icons.plus}>
                Create new lecture
                </IconButton>
            </LinkContainer>
            </ButtonToolbar>
        </div>
    );
  }
}
