import React from 'react';

import { classes } from '../../lib/tools';
import { Icon } from './Icon';
import { Button } from 'react-bootstrap';

import './IconButton.css';

export function IconButton({
  className,
  icon,
  disabled,
  size,
  variant,
  onClick,
  children,
  ...props
}) {
  return (
    <Button
      className={classes('IconButton', className)}
      size={size}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <Icon icon={icon} />}
      <span>{children}</span>
    </Button>
  );
}

IconButton.icons = Icon;
