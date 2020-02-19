import React from 'react';
import * as PropTypes from 'prop-types';

import { classes } from '../../lib/tools';
import { Time } from './Time';

import './DataTable.css';

export class DataTableColumn {
  constructor(field, title, render) {
    this.field = field;
    this.title = title;
    this.render = render;
  }
}

export class DataTable extends React.Component {
  static propTypes = {
    className: PropTypes.string,

    // List of DataTableColumn-s
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,

    // Optional arg that will be provided to column render() functions
    renderArg: PropTypes.any,

    // Data to be displayed in table. List of objects.
    data: PropTypes.array,

    // What to display if there is no data
    noDataPlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    // Property or function to get key of rows
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  };

  static defaultProps = {
    rowKey: 'id',
  };

  getRowKey = (item, index) => {
    if (!this.props.rowKey) {
      // Without rowKey, return row index
      return index;
    }

    if (typeof this.props.rowKey === 'string') {
      // In this case, rowKey is something like "id"
      return item[this.props.rowKey] || 'ix_' + index;
    }

    // Treat as custom function
    return this.props.rowKey(item, index);
  };

  /**
   * @param {DataTableColumn} column
   * @param columnIndex
   */
  renderHeader(column, columnIndex) {
    let className = classes(
      'DataTable-th-index-' + columnIndex,
      column.field && 'DataTable-th-field-' + column.field
    );

    return (
      <th key={column.field || columnIndex} className={className}>
        {column.title}
      </th>
    );
  }

  renderHeaders() {
    const cols = [];

    this.props.columns.forEach((column, index) => cols.push(this.renderHeader(column, index)));

    return <tr>{cols}</tr>;
  }

  renderRow = (item, rowIndex) => {
    const rowKey = this.getRowKey(item, rowIndex);

    const cols = [];

    this.props.columns.forEach((/** DataTableColumn */ column, colIndex) => {
      const className = classes(
        'DataTable-td-index-' + colIndex,
        column.field && 'DataTable-td-field-' + column.field
      );

      let content = undefined;
      if (column.render) {
        if (column.render.length > 1) {
          // Only get the extra values if function is gonna use them
          content = column.render(item, item[column.field], this.props.renderArg);
        } else {
          content = column.render(item);
        }
      } else {
        content = item[column.field];
        if (content instanceof Date) {
          content = <Time value={content} className="text-nowrap" />;
        }
      }

      cols.push(
        <td className={'DataTable-td-mobile-label'} key={`${colIndex}_mob`}>
          {column.title}
        </td>
      );
      cols.push(
        <td className={className} key={colIndex}>
          {content}
        </td>
      );
    });

    return <tr key={rowKey}>{cols}</tr>;
  };

  renderRows() {
    if (!this.props.data) {
      return null;
    }
    if (!this.props.data.length) {
      const noData = this.props.noDataPlaceholder || 'No data';

      return (
        <tr>
          <td colSpan="100" className={'DataTable-no-data'}>
            {noData}
          </td>
        </tr>
      );
    }

    const rows = this.props.data.map(this.renderRow);

    return <>{rows}</>;
  }

  render() {
    return (
      <table className={`DataTable table ${this.props.className || ''}`}>
        <thead>{this.renderHeaders()}</thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}
