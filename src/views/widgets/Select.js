import React from 'react';
import * as PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import ReactSelectAsync from 'react-select/async';

import { classes } from '../../lib/tools';

import './Select.css';

export const Select = ({ async, className, ...rest }) => {
  className = classes('Select', className);
  const SelectClass = async ? ReactSelectAsync : ReactSelect;
  return <SelectClass className={className} classNamePrefix={'Select'} {...rest} />;
};

Select.propTypes = {
  async: PropTypes.bool,
  options: PropTypes.array,
  loadOptions: PropTypes.func,
  defaultOptions: PropTypes.any,
  onChange: PropTypes.func,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  inputId: PropTypes.any,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  noOptionsMessage: PropTypes.any,
  isClearable: PropTypes.any,
  isMulti: PropTypes.any,
};
