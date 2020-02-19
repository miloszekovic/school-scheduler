import React from 'react';
import { Icon } from './Icon';
import { Button, Modal } from 'react-bootstrap';

export function ConfirmModal({
  show,
  callback,
  title = 'Are you sure?',
  confirmLabel = 'Yes',
  confirmVariant = 'danger',
  children,
}) {
  return (
    <Modal show={show} onHide={() => callback(false)} aria-labelledby="Confirm modal">
      <Modal.Header closeButton>
        <Modal.Title id="Confirm modal title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant={confirmVariant} onClick={() => callback(true)}>
          <Icon icon={Icon.exclamation_tringle} />
          <span>{confirmLabel}</span>
        </Button>
        <Button variant="secondary" onClick={() => callback(false)}>
          <Icon icon={Icon.close} />
          <span>Cancel</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
